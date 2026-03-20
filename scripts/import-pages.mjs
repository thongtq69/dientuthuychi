import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { getPageSlugFromUrl, getPathSegments, toRichTextParagraphs, toSummaryParagraphs } from './lib/content-mappers.mjs';
import { createReport as createMediaReport, ensureTempDir, shouldSkipProductImage, upsertMedia, writeReport } from './lib/media-utils.mjs';
import { loadSiteDataSnapshot } from './lib/site-data-snapshot.mjs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const pagesDir = path.join(projectRoot, 'pages-json');
const reportPath = path.join(projectRoot, 'scripts/reports/page-import-report.json');

const SKIPPED_TOP_LEVEL_SLUGS = new Set(['cart', 'cart-installment']);

function parseArgs(argv) {
  return {
    write: argv.includes('--write'),
    json: argv.includes('--json'),
  };
}

function pickPageImage(images = []) {
  return images.find((image) => image && !shouldSkipProductImage(image)) || null;
}

function buildContentPageRecord(page, fileName) {
  const routePath = getPathSegments(page.url).join('/');
  const slug = routePath.replace(/\//g, '-');
  const title = page.h1 || page.title || slug;
  const description = page.meta_description || null;
  const summaryParagraphs = toSummaryParagraphs(page.text, [description, `Nguon migration: ${page.url}`]);
  const image = pickPageImage(page.images);

  const blocks = [
    {
      blockType: 'rich-text',
      title: 'Tong quan',
      content: toRichTextParagraphs(summaryParagraphs),
      ctaLabel: 'Nguon goc',
      ctaHref: page.url,
    },
  ];

  if (image) {
    blocks.push({
      blockType: 'media',
      title: 'Hero image',
      ctaLabel: 'Trang goc',
      ctaHref: page.url,
      imageSource: image,
    });
  }

  return {
    source: 'pages-json',
    sourceFile: fileName,
    sourceUrl: page.url,
    slug,
    routePath,
    title,
    description,
    image,
    contentParagraphs: summaryParagraphs,
    hero: {
      eyebrow: 'Trang noi dung',
      title,
      description,
      primaryLabel: 'Xem trang goc',
      primaryHref: page.url,
    },
    blocks,
    seo: {
      title: page.title || title,
      description,
    },
  };
}

function buildStoreSystemRecord(snapshot) {
  const supportItems = [snapshot.siteMeta.hotline, snapshot.siteMeta.supportHours].filter(Boolean).join(' - ');
  const paragraphs = [
    'Trang showroom nay duoc migrate tu du lieu local de Task 7 co the chuyen sang data layer ma khong doi route public.',
    ...snapshot.storeLocations,
    supportItems ? `Tu van nhanh: ${supportItems}` : null,
  ].filter(Boolean);

  return {
    source: 'local-site-data',
    sourceFile: 'src/data/siteData.js',
    sourceUrl: '/he-thong-cua-hang',
    slug: 'he-thong-cua-hang',
    routePath: 'he-thong-cua-hang',
    title: 'He thong cua hang',
    description: 'Thong tin showroom va diem ban dang duoc giu local trong storefront hien tai.',
    image: '/logo-thuychi.jpg',
    contentParagraphs: paragraphs,
    hero: {
      eyebrow: 'Showroom',
      title: 'He thong cua hang',
      description: 'Tong hop nhanh diem ban va kenh tu van de frontend co the fallback sang Payload.',
      primaryLabel: 'Goi tu van',
      primaryHref: `tel:${snapshot.siteMeta.hotline || ''}`,
    },
    blocks: [
      {
        blockType: 'rich-text',
        title: 'Dia chi showroom',
        content: toRichTextParagraphs(paragraphs),
      },
      {
        blockType: 'media',
        title: 'Nhan dien thuong hieu',
        imageSource: '/logo-thuychi.jpg',
      },
    ],
    seo: {
      title: `He thong cua hang | ${snapshot.siteMeta.name}`,
      description: 'Danh sach diem ban va thong tin lien he cua he thong Dien tu Thuy Chi.',
    },
  };
}

async function buildPageRecords() {
  const entries = (await fs.readdir(pagesDir)).filter((entry) => entry.endsWith('.json')).sort();
  const records = [];
  const skippedUnsupportedRoutes = [];

  for (const entry of entries) {
    const raw = await fs.readFile(path.join(pagesDir, entry), 'utf8');
    const page = JSON.parse(raw);

    if (page.page_type !== 'content' || !page.url) {
      continue;
    }

    const segments = getPathSegments(page.url);
    const slug = segments.at(-1);
    if (!slug || SKIPPED_TOP_LEVEL_SLUGS.has(slug) || slug.startsWith('test-')) {
      skippedUnsupportedRoutes.push({ file: entry, url: page.url, slug });
      continue;
    }

    records.push(buildContentPageRecord(page, entry));
  }

  const snapshot = await loadSiteDataSnapshot();
  records.push(buildStoreSystemRecord(snapshot));

  return {
    records,
    skippedNestedRoutes: [],
    skippedUnsupportedRoutes,
  };
}

async function upsertPages(records, report) {
  const { destroyPayloadClient, getPayloadClient } = await import('./lib/payload-client.mjs');
  const payload = await getPayloadClient();
  const tempDir = await ensureTempDir('task-4-pages-');
  const result = { created: 0, updated: 0 };

  try {
    for (const record of records) {
      const heroImageDoc = record.image
        ? await upsertMedia(payload, record.image, {
            alt: record.title,
            projectRoot,
            report,
            tempDir,
          }).catch((error) => {
            report.brokenMappings.push({ slug: record.slug, reason: error.message, source: record.image });
            return null;
          })
        : null;

      const blocks = [];
      for (const block of record.blocks) {
        if (block.blockType === 'media') {
          let imageDoc = null;
          if (block.imageSource) {
            imageDoc = await upsertMedia(payload, block.imageSource, {
              alt: `${record.title} ${block.title || 'media'}`,
              projectRoot,
              report,
              tempDir,
            }).catch((error) => {
              report.brokenMappings.push({ slug: record.slug, reason: error.message, source: block.imageSource });
              return null;
            });
          }

          blocks.push({
            blockType: block.blockType,
            title: block.title,
            image: imageDoc?.id || null,
            ctaLabel: block.ctaLabel,
            ctaHref: block.ctaHref,
          });
          continue;
        }

        blocks.push({
          blockType: block.blockType,
          title: block.title,
          content: block.content,
          ctaLabel: block.ctaLabel,
          ctaHref: block.ctaHref,
        });
      }

      const data = {
        title: record.title,
        slug: record.slug,
        routePath: record.routePath,
        hero: {
          ...record.hero,
          image: heroImageDoc?.id || null,
        },
        blocks,
        content: toRichTextParagraphs(record.contentParagraphs),
        seo: {
          ...record.seo,
          image: heroImageDoc?.id || null,
        },
      };

      const existing = await payload.find({
        collection: 'pages',
        depth: 0,
        limit: 1,
        pagination: false,
        overrideAccess: true,
        where: {
          or: [
            {
              routePath: {
                equals: record.routePath,
              },
            },
            {
              slug: {
                equals: record.slug,
              },
            },
          ],
        },
      });

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'pages',
          id: existing.docs[0].id,
          data,
          overrideAccess: true,
        });
        result.updated += 1;
      } else {
        await payload.create({
          collection: 'pages',
          data,
          overrideAccess: true,
        });
        result.created += 1;
      }

      if (report.sampleChecks.length < 5) {
        report.sampleChecks.push({
          type: 'page',
          slug: record.slug,
          source: record.source,
          heroImage: Boolean(heroImageDoc?.id),
          blockCount: blocks.length,
        });
      }
    }

    return result;
  } finally {
    await destroyPayloadClient();
    await fs.rm(tempDir, { force: true, recursive: true });
  }
}

function printTextReport(finalReport) {
  console.log(`Candidate pages: ${finalReport.summary.candidatePages}`);
  console.log(`Nested pages skipped: ${finalReport.summary.skippedNestedRoutes}`);
  console.log(`Unsupported top-level routes skipped: ${finalReport.summary.skippedUnsupportedRoutes}`);
  console.log(`Imported slugs: ${finalReport.importedSlugs.join(', ')}`);

  if (finalReport.writeResult) {
    console.log(`Payload created: ${finalReport.writeResult.created}`);
    console.log(`Payload updated: ${finalReport.writeResult.updated}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { records, skippedNestedRoutes, skippedUnsupportedRoutes } = await buildPageRecords();
  const mediaReport = createMediaReport();
  const writeResult = args.write ? await upsertPages(records, mediaReport) : null;

  const finalReport = {
    generatedAt: new Date().toISOString(),
    dryRun: !args.write,
    summary: {
      candidatePages: records.length,
      skippedNestedRoutes: skippedNestedRoutes.length,
      skippedUnsupportedRoutes: skippedUnsupportedRoutes.length,
    },
    importedSlugs: records.map((record) => record.routePath),
    skippedNestedRoutes,
    skippedUnsupportedRoutes,
    writeResult,
    mediaTotals: mediaReport.totals,
    sampleChecks: mediaReport.sampleChecks,
    missingImageSources: mediaReport.missingImageSources.slice(0, 20),
    brokenMappings: mediaReport.brokenMappings.slice(0, 20),
  };

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await writeReport(reportPath, finalReport);

  if (args.json) {
    console.log(JSON.stringify({ reportPath, ...finalReport }, null, 2));
    return;
  }

  printTextReport(finalReport);
  console.log(`Report saved: ${reportPath}`);

  if (!args.write) {
    console.log('Dry run only. Add --write to upsert pages into Payload.');
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
