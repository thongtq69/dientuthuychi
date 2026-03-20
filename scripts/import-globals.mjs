import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { normalizeSlug, toRichTextParagraphs } from './lib/content-mappers.mjs';
import { createReport as createMediaReport, ensureTempDir, upsertMedia, writeReport } from './lib/media-utils.mjs';
import { loadSiteDataSnapshot } from './lib/site-data-snapshot.mjs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '..');
const reportPath = path.join(projectRoot, 'scripts/reports/global-import-report.json');

function parseArgs(argv) {
  return {
    write: argv.includes('--write'),
    json: argv.includes('--json'),
  };
}

function getContactValue(entries, label) {
  const target = normalizeSlug(label);
  return entries.find((entry) => normalizeSlug(entry.label || '') === target)?.value || null;
}

function buildGlobals(snapshot) {
  const topBarText = snapshot.storeBenefits.join(' • ');
  const socialMap = Object.fromEntries(snapshot.socialLinks.map((entry) => [String(entry.title || '').toLowerCase(), entry.href]));

  return {
    siteSettings: {
      siteName: snapshot.siteMeta.name,
      logo: '/logo-thuychi.jpg',
      contact: {
        phone: snapshot.siteMeta.hotline,
        hotline: getContactValue(snapshot.footerContactInfo, 'Hotline') || snapshot.siteMeta.hotline,
        email: snapshot.siteMeta.email,
        address: getContactValue(snapshot.footerContactInfo, 'Dia chi') || snapshot.siteMeta.address,
        workingHours: getContactValue(snapshot.footerContactInfo, 'Thoi gian') || snapshot.siteMeta.supportHours,
      },
      social: {
        facebook: socialMap.facebook || null,
        tiktok: socialMap.tiktok || null,
        zalo: null,
        youtube: null,
      },
      header: {
        topBarText,
      },
      footer: {
        address: getContactValue(snapshot.footerContactInfo, 'Dia chi') || snapshot.siteMeta.address,
        hotline: getContactValue(snapshot.footerContactInfo, 'Hotline') || snapshot.siteMeta.hotline,
        email: getContactValue(snapshot.footerContactInfo, 'Email') || snapshot.siteMeta.email,
      },
      seo: {
        title: snapshot.siteMeta.name,
        description: snapshot.siteMeta.tagline,
      },
      integrations: {
        freeShipThreshold: 500000,
      },
    },
    promotions: {
      active: true,
      title: 'Khuyen mai noi bat',
      content: toRichTextParagraphs([
        'Noi dung khuyen mai duoc migrate tu du lieu local de Task 7 co the doi sang Payload-first voi fallback an toan.',
        ...snapshot.storeBenefits,
        ...snapshot.midPageBanners.map((banner) => `${banner.title}: ${banner.href}`),
      ]),
      banner: snapshot.midPageBanners[0]?.image || null,
    },
  };
}

async function resolveLinkedBanners(payload) {
  const banners = await payload.find({
    collection: 'banners',
    depth: 0,
    limit: 20,
    pagination: false,
    overrideAccess: true,
  });

  return banners.docs
    .filter((banner) => ['home-mid', 'promo-campaign', 'promotion'].includes(banner.position))
    .slice(0, 5)
    .map((banner) => banner.id);
}

async function writeGlobals(globalsData, report) {
  const { destroyPayloadClient, getPayloadClient } = await import('./lib/payload-client.mjs');
  const payload = await getPayloadClient();
  const tempDir = await ensureTempDir('task-4-globals-');

  try {
    const logoDoc = await upsertMedia(payload, globalsData.siteSettings.logo, {
      alt: globalsData.siteSettings.siteName,
      projectRoot,
      report,
      tempDir,
    }).catch((error) => {
      report.brokenMappings.push({ slug: 'site-settings', reason: error.message, source: globalsData.siteSettings.logo });
      return null;
    });

    const promoBannerDoc = globalsData.promotions.banner
      ? await upsertMedia(payload, globalsData.promotions.banner, {
          alt: globalsData.promotions.title,
          projectRoot,
          report,
          tempDir,
        }).catch((error) => {
          report.brokenMappings.push({ slug: 'promotions', reason: error.message, source: globalsData.promotions.banner });
          return null;
        })
      : null;

    const linkedBanners = await resolveLinkedBanners(payload).catch(() => []);

    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        ...globalsData.siteSettings,
        logo: logoDoc?.id || null,
        seo: {
          ...globalsData.siteSettings.seo,
          image: logoDoc?.id || null,
        },
      },
      overrideAccess: true,
    });

    await payload.updateGlobal({
      slug: 'promotions',
      data: {
        ...globalsData.promotions,
        banner: promoBannerDoc?.id || null,
        linkedBanners,
      },
      overrideAccess: true,
    });

    report.sampleChecks.push(
      { type: 'global', slug: 'site-settings', hasLogo: Boolean(logoDoc?.id) },
      { type: 'global', slug: 'promotions', hasBanner: Boolean(promoBannerDoc?.id), linkedBanners: linkedBanners.length },
    );
  } finally {
    await destroyPayloadClient();
    await fs.rm(tempDir, { force: true, recursive: true });
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const snapshot = await loadSiteDataSnapshot();
  const globalsData = buildGlobals(snapshot);
  const mediaReport = createMediaReport();

  if (args.write) {
    await writeGlobals(globalsData, mediaReport);
  }

  const finalReport = {
    generatedAt: new Date().toISOString(),
    dryRun: !args.write,
    globals: ['site-settings', 'promotions'],
    mappedFields: {
      siteSettings: {
        siteName: globalsData.siteSettings.siteName,
        topBarText: globalsData.siteSettings.header.topBarText,
        hotline: globalsData.siteSettings.contact.hotline,
      },
      promotions: {
        title: globalsData.promotions.title,
        active: globalsData.promotions.active,
        bannerSource: globalsData.promotions.banner,
      },
    },
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

  console.log(`Globals mapped: ${finalReport.globals.join(', ')}`);
  console.log(`Report saved: ${reportPath}`);

  if (!args.write) {
    console.log('Dry run only. Add --write to upsert globals into Payload.');
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
