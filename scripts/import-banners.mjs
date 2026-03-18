import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { bannerSources } from './lib/banner-sources.mjs';
import { getPayloadClient } from './lib/payload-client.mjs';
import { createReport, ensureTempDir, upsertMedia, writeReport } from './lib/media-utils.mjs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const reportPath = path.join(projectRoot, 'scripts/reports/banner-import-report.json');

async function main() {
  const payload = await getPayloadClient();
  const report = createReport();
  const tempDir = await ensureTempDir('task-3-banner-');

  try {
    for (const banner of bannerSources) {
      let imageDoc;
      let mobileImageDoc = null;

      try {
        imageDoc = await upsertMedia(payload, banner.image, {
          alt: banner.title,
          projectRoot,
          report,
          tempDir,
        });

        if (banner.mobileImage) {
          mobileImageDoc = await upsertMedia(payload, banner.mobileImage, {
            alt: `${banner.title} mobile`,
            projectRoot,
            report,
            tempDir,
          });
        }
      } catch (error) {
        report.missingBanners.push({ slug: banner.slug, reason: error.message, sourceUrl: banner.sourceUrl });
        continue;
      }

      report.totals.bannerMatched += 1;
      report.bannerPositions[banner.position] = (report.bannerPositions[banner.position] || 0) + 1;

      const existing = await payload.find({
        collection: 'banners',
        depth: 0,
        limit: 1,
        overrideAccess: true,
        pagination: false,
        where: {
          slug: {
            equals: banner.slug,
          },
        },
      });

      const data = {
        title: banner.title,
        key: banner.slug,
        slug: banner.slug,
        position: banner.position,
        image: imageDoc.id,
        mobileImage: mobileImageDoc?.id,
        link: banner.link,
        active: true,
        sortOrder: banner.order || 0,
        order: banner.order || 0,
        sourceUrl: banner.sourceUrl,
      };

      if (existing.docs.length > 0) {
        await payload.update({
          collection: 'banners',
          id: existing.docs[0].id,
          data,
          overrideAccess: true,
        });
        report.totals.bannerUpdated += 1;
      } else {
        await payload.create({
          collection: 'banners',
          data,
          overrideAccess: true,
        });
        report.totals.bannerCreated += 1;
      }

      if (report.sampleChecks.length < 5) {
        report.sampleChecks.push({
          type: 'banner',
          slug: banner.slug,
          position: banner.position,
          desktop: banner.image,
          mobile: banner.mobileImage || null,
        });
      }
    }

    await writeReport(reportPath, report);
    console.log(JSON.stringify({ ok: true, reportPath, totals: report.totals, positions: report.bannerPositions }, null, 2));
  } finally {
    await payload.destroy();
    await fs.rm(tempDir, { force: true, recursive: true });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
