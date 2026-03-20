import fs from 'fs/promises';
import path from 'path';

import {
  compareBreakdown,
  compareProductIntegrity,
  compareSlugSets,
  ensureReportsDir,
  getLocalBannerSnapshot,
  getLocalPageSnapshot,
  getLocalPostSnapshot,
  getLocalProductSnapshot,
  getPayloadSnapshot,
  projectRoot,
  reportsDir,
  summarizePayloadBanners,
  summarizePayloadContent,
  summarizePayloadProducts,
} from './lib/task8-utils.mjs';

const reportPath = path.join(reportsDir, 'compare-local-vs-payload.json');

function countStatus(localCount, payloadCount) {
  return localCount === payloadCount ? 'match' : 'mismatch';
}

function summarizeStatus(compareReport) {
  if (!compareReport.payload.ok) {
    return 'blocked';
  }

  const hasMismatch = [
    compareReport.products.counts.status,
    compareReport.banners.counts.status,
    compareReport.pages.counts.status,
    compareReport.posts.counts.status,
  ].includes('mismatch');

  if (hasMismatch || compareReport.products.integrity.mismatchCount > 0) {
    return 'needs_attention';
  }

  return 'ready';
}

function printDatasetLine(name, dataset) {
  console.log(`${name}: local=${dataset.counts.local} payload=${dataset.counts.payload} status=${dataset.counts.status}`);
}

async function main() {
  const [localPages, payload] = await Promise.all([getLocalPageSnapshot(), getPayloadSnapshot()]);
  const localProducts = getLocalProductSnapshot();
  const localBanners = getLocalBannerSnapshot();
  const localPosts = getLocalPostSnapshot();

  const payloadProducts = summarizePayloadProducts(payload.products);
  const payloadBanners = summarizePayloadBanners(payload.banners);
  const payloadPages = summarizePayloadContent(payload.pages);
  const payloadPosts = summarizePayloadContent(payload.posts);

  const compareReport = {
    generatedAt: new Date().toISOString(),
    payload: {
      ok: payload.ok,
      error: payload.error || null,
    },
    products: {
      counts: {
        local: localProducts.count,
        payload: payloadProducts.count,
        status: countStatus(localProducts.count, payloadProducts.count),
      },
      slugDiff: compareSlugSets(localProducts.slugs, payloadProducts.slugs),
      categoryBreakdown: compareBreakdown(localProducts.byCategory, payloadProducts.byCategory),
      integrity: compareProductIntegrity(localProducts, payloadProducts),
    },
    banners: {
      counts: {
        local: localBanners.count,
        payload: payloadBanners.count,
        status: countStatus(localBanners.count, payloadBanners.count),
      },
      slugDiff: compareSlugSets(localBanners.slugs, payloadBanners.slugs),
      positionBreakdown: compareBreakdown(localBanners.byPosition, payloadBanners.byPosition),
    },
    pages: {
      counts: {
        local: localPages.count,
        payload: payloadPages.count,
        status: countStatus(localPages.count, payloadPages.count),
      },
      slugDiff: compareSlugSets(localPages.slugs, payloadPages.slugs),
    },
    posts: {
      counts: {
        local: localPosts.count,
        payload: payloadPosts.count,
        status: countStatus(localPosts.count, payloadPosts.count),
      },
      slugDiff: compareSlugSets(localPosts.slugs, payloadPosts.slugs),
    },
  };

  const finalReport = {
    ...compareReport,
    status: summarizeStatus(compareReport),
    notes: {
      pagesSource: 'Local pages are derived from `pages-json/*.json` with `page_type === content`.',
      productImageRule: 'Integrity check flags products missing image/specs/variants parity or losing gallery data during migration.',
      projectRoot,
    },
  };

  await ensureReportsDir();
  await fs.writeFile(reportPath, `${JSON.stringify(finalReport, null, 2)}\n`, 'utf8');

  console.log(`Status: ${finalReport.status}`);
  if (!finalReport.payload.ok) {
    console.log(`Payload access: blocked (${finalReport.payload.error})`);
  }
  printDatasetLine('Products', finalReport.products);
  printDatasetLine('Banners', finalReport.banners);
  printDatasetLine('Pages', finalReport.pages);
  printDatasetLine('Posts', finalReport.posts);
  console.log(`Product integrity mismatches: ${finalReport.products.integrity.mismatchCount}`);
  console.log(`Report saved: ${reportPath}`);
}

main()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
