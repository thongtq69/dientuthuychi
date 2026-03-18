import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { getPayloadClient } from './lib/payload-client.mjs';
import {
  createReport,
  ensureTempDir,
  shouldSkipProductImage,
  uniqueList,
  upsertMedia,
  writeReport,
} from './lib/media-utils.mjs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const pagesDir = path.join(projectRoot, 'pages-json');
const reportPath = path.join(projectRoot, 'scripts/reports/media-import-report.json');

function getProductSlug(page) {
  const pathname = new URL(page.normalized_product?.source_url || page.url).pathname;
  return pathname.replace(/^\//, '');
}

function buildProductImageSet(page) {
  const primary = page.normalized_product?.primary_image || null;
  const variantImages = (page.normalized_product?.variants || []).map((variant) => variant.image);
  const featureImages = (page.featured_highlights || []).flatMap((highlight) => highlight.images || []);

  return {
    primary,
    gallery: uniqueList([...variantImages, ...featureImages].filter((image) => !shouldSkipProductImage(image) && image !== primary)),
  };
}

async function loadProductPages() {
  const entries = await fs.readdir(pagesDir);
  const pages = [];

  for (const entry of entries) {
    if (!entry.endsWith('.json')) {
      continue;
    }

    const raw = await fs.readFile(path.join(pagesDir, entry), 'utf8');
    const page = JSON.parse(raw);
    if (page.page_type === 'product' && page.normalized_product?.source_url) {
      pages.push(page);
    }
  }

  return pages;
}

async function main() {
  const payload = await getPayloadClient();
  const report = createReport();
  const tempDir = await ensureTempDir('task-3-media-');

  try {
    const pages = await loadProductPages();

    for (const page of pages) {
      const slug = getProductSlug(page);
      const productLookup = await payload.find({
        collection: 'products',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        pagination: false,
        where: {
          slug: {
            equals: slug,
          },
        },
      });

      if (productLookup.docs.length === 0) {
        report.totals.productMissing += 1;
        report.missingProducts.push({ slug, source: page.url });
        continue;
      }

      report.totals.productMatched += 1;
      const product = productLookup.docs[0];
      const { primary, gallery } = buildProductImageSet(page);

      if (!primary || shouldSkipProductImage(primary)) {
        report.missingImageSources.push({ slug, source: primary, reason: 'missing-primary-image' });
        continue;
      }

      let mainImage;
      try {
        mainImage = await upsertMedia(payload, primary, {
          alt: page.normalized_product?.name || product.name,
          projectRoot,
          report,
          tempDir,
        });
      } catch (error) {
        report.brokenMappings.push({ slug, source: primary, reason: error.message });
        continue;
      }

      const galleryItems = [];
      for (const source of gallery) {
        try {
          const mediaDoc = await upsertMedia(payload, source, {
            alt: page.normalized_product?.name || product.name,
            projectRoot,
            report,
            tempDir,
          });

          if (mediaDoc?.id && mediaDoc.id !== mainImage.id) {
            galleryItems.push({ image: mediaDoc.id });
          }
        } catch (error) {
          report.brokenMappings.push({ slug, source, reason: error.message });
        }
      }

      await payload.update({
        collection: 'products',
        id: product.id,
        data: {
          mainImage: mainImage.id,
          gallery: galleryItems,
        },
        overrideAccess: true,
      });

      report.totals.productUpdated += 1;
      if (report.sampleChecks.length < 5) {
        report.sampleChecks.push({
          type: 'product',
          slug,
          mainImage: primary,
          galleryCount: galleryItems.length,
        });
      }
    }

    await writeReport(reportPath, report);
    console.log(JSON.stringify({ ok: true, reportPath, totals: report.totals }, null, 2));
  } finally {
    await payload.destroy();
    await fs.rm(tempDir, { force: true, recursive: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
