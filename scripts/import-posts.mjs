import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { mapPostCategory, parseVietnameseDate, toRichTextParagraphs } from './lib/content-mappers.mjs';
import { createReport as createMediaReport, ensureTempDir, upsertMedia, writeReport } from './lib/media-utils.mjs';
import { loadSiteDataSnapshot } from './lib/site-data-snapshot.mjs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const reportPath = path.join(projectRoot, 'scripts/reports/post-import-report.json');

function parseArgs(argv) {
  return {
    write: argv.includes('--write'),
    json: argv.includes('--json'),
  };
}

function buildPostRecord(post) {
  const paragraphs = [post.intro, ...post.sections.flatMap((section) => [section.heading, ...section.paragraphs])].filter(Boolean);

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    category: mapPostCategory(post.category),
    publishedAt: parseVietnameseDate(post.date),
    coverImage: post.image,
    content: toRichTextParagraphs(paragraphs),
    seo: {
      title: post.title,
      description: post.excerpt,
    },
    tags: [post.category, post.readTime].filter(Boolean).map((tag) => ({ tag })),
  };
}

async function upsertPosts(records, report) {
  const { destroyPayloadClient, getPayloadClient } = await import('./lib/payload-client.mjs');
  const payload = await getPayloadClient();
  const tempDir = await ensureTempDir('task-4-posts-');
  const result = { created: 0, updated: 0 };

  try {
    for (const record of records) {
      const coverDoc = record.coverImage
        ? await upsertMedia(payload, record.coverImage, {
            alt: record.title,
            projectRoot,
            report,
            tempDir,
          }).catch((error) => {
            report.brokenMappings.push({ slug: record.slug, reason: error.message, source: record.coverImage });
            return null;
          })
        : null;

      const data = {
        title: record.title,
        slug: record.slug,
        excerpt: record.excerpt,
        category: record.category,
        status: 'published',
        publishedAt: record.publishedAt,
        coverImage: coverDoc?.id || null,
        content: record.content,
        seo: {
          ...record.seo,
          image: coverDoc?.id || null,
        },
        tags: record.tags,
      };

      const existing = await payload.find({
        collection: 'posts',
        depth: 0,
        limit: 1,
        pagination: false,
        overrideAccess: true,
        where: {
          slug: {
            equals: record.slug,
          },
        },
      });

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'posts',
          id: existing.docs[0].id,
          data,
          overrideAccess: true,
        });
        result.updated += 1;
      } else {
        await payload.create({
          collection: 'posts',
          data,
          overrideAccess: true,
        });
        result.created += 1;
      }

      if (report.sampleChecks.length < 5) {
        report.sampleChecks.push({
          type: 'post',
          slug: record.slug,
          category: record.category,
          hasCoverImage: Boolean(coverDoc?.id),
        });
      }
    }

    return result;
  } finally {
    await destroyPayloadClient();
    await fs.rm(tempDir, { force: true, recursive: true });
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const snapshot = await loadSiteDataSnapshot();
  const records = snapshot.blogPosts.map(buildPostRecord);
  const mediaReport = createMediaReport();
  const writeResult = args.write ? await upsertPosts(records, mediaReport) : null;

  const finalReport = {
    generatedAt: new Date().toISOString(),
    dryRun: !args.write,
    summary: {
      candidatePosts: records.length,
    },
    importedSlugs: records.map((record) => record.slug),
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

  console.log(`Candidate posts: ${finalReport.summary.candidatePosts}`);
  console.log(`Imported slugs: ${finalReport.importedSlugs.join(', ')}`);
  if (writeResult) {
    console.log(`Payload created: ${writeResult.created}`);
    console.log(`Payload updated: ${writeResult.updated}`);
  }
  console.log(`Report saved: ${reportPath}`);

  if (!args.write) {
    console.log('Dry run only. Add --write to upsert posts into Payload.');
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
