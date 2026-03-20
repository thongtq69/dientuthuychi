import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { products as giakhoProducts } from '../src/data/giakhoData.js';
import { nonApplePhonesProducts } from '../src/data/nonApplePhonesData.js';
import { nonAppleTabletsProducts } from '../src/data/nonAppleTabletsData.js';

import { dedupeProducts, buildImportReport } from './lib/product-dedup.mjs';
import { toTask1Product } from './lib/product-mappers.mjs';
import { createReport as createMediaReport, writeReport } from './lib/media-utils.mjs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const reportPath = path.join(dirname, 'reports', 'product-import-report.json');

const sources = [
  ['giakho', giakhoProducts],
  ['nonApplePhones', nonApplePhonesProducts],
  ['nonAppleTablets', nonAppleTabletsProducts],
];

function parseArgs(argv) {
  return {
    write: argv.includes('--write'),
    json: argv.includes('--json'),
  };
}

function uniqueEntries(entries) {
  const seen = new Set();

  return (entries || []).filter((entry) => {
    const key = JSON.stringify(entry);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function buildProducts() {
  const rawTotal = sources.reduce((total, [, products]) => total + products.length, 0);
  const normalized = [];

  for (const [sourceName, products] of sources) {
    for (const product of products) {
      const normalizedProduct = toTask1Product(product, sourceName);

      if (normalizedProduct) {
        normalized.push(normalizedProduct);
      }
    }
  }

  const { products, duplicateGroups } = dedupeProducts(normalized);

  return {
    products,
    duplicateGroups,
    report: buildImportReport({
      rawTotal,
      filteredTotal: normalized.length,
      products,
      duplicateGroups,
    }),
  };
}

function printTextReport(report, writeResult) {
  console.log(`Raw records: ${report.rawTotal}`);
  console.log(`After filter Apple/test: ${report.filteredTotal}`);
  console.log(`After dedupe/import set: ${report.importedTotal}`);
  console.log(`Duplicate merges: ${report.duplicateTotal}`);
  console.log(`Missing image: ${report.missingImage}`);
  console.log(`Missing specs: ${report.missingSpecs}`);
  console.log('By category:');

  for (const [categorySlug, count] of Object.entries(report.byCategory)) {
    console.log(`- ${categorySlug}: ${count}`);
  }

  if (writeResult) {
    console.log(`Payload created: ${writeResult.created}`);
    console.log(`Payload updated: ${writeResult.updated}`);
  }

  console.log('Sample records:');
  for (const item of report.sample) {
    console.log(`- ${item.slug} | group=${item.productGroup || 'n/a'} | category=${item.categorySlug} | image=${item.image ? 'yes' : 'no'} | specs=${item.specs}/${item.technicalSections}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { products, report } = buildProducts();
  let writeResult = null;
  const mediaReport = createMediaReport();

  if (args.write) {
    const { destroyPayloadClient, upsertProductsToPayload } = await import('./lib/payload-client.mjs');
    try {
      writeResult = await upsertProductsToPayload(products, mediaReport);
    } finally {
      await destroyPayloadClient();
    }
  }

  const finalReport = {
    generatedAt: new Date().toISOString(),
    report,
    writeResult,
    mediaTotals: mediaReport.totals,
    sampleChecks: mediaReport.sampleChecks,
    missingImageSources: uniqueEntries(mediaReport.missingImageSources).slice(0, 20),
    brokenMappings: uniqueEntries(mediaReport.brokenMappings).slice(0, 20),
    missingProducts: uniqueEntries(mediaReport.missingProducts).slice(0, 20),
  };

  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await writeReport(reportPath, finalReport);

  if (args.json) {
    console.log(JSON.stringify({ reportPath, ...finalReport }, null, 2));
    return;
  }

  printTextReport(report, writeResult);
  console.log(`Report saved: ${reportPath}`);

  if (!args.write) {
    console.log('Dry run only. Add --write to upsert into Payload after Task 1 schema is ready.');
  }

  process.exit(0);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
