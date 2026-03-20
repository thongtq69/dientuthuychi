import { getDuplicateKey, mergeProductData } from './product-mappers.mjs';

export function dedupeProducts(products) {
  const deduped = new Map();
  const duplicateGroups = [];

  for (const product of products) {
    const key = getDuplicateKey(product);
    const existing = deduped.get(key);

    if (!existing) {
      deduped.set(key, product);
      continue;
    }

    const merged = mergeProductData(existing, product);
    deduped.set(key, merged);
    duplicateGroups.push({
      key,
      keptSlug: merged.slug,
      incomingSlug: product.slug,
      existingSlug: existing.slug,
    });
  }

  const dedupedBySlug = new Map()

  for (const product of deduped.values()) {
    const existing = dedupedBySlug.get(product.slug)

    if (!existing) {
      dedupedBySlug.set(product.slug, product)
      continue
    }

    const merged = mergeProductData(existing, product)
    dedupedBySlug.set(product.slug, merged)
    duplicateGroups.push({
      key: `slug:${product.slug}`,
      keptSlug: merged.slug,
      incomingSlug: product.slug,
      existingSlug: existing.slug,
    })
  }

  return {
    products: [...dedupedBySlug.values()],
    duplicateGroups,
  };
}

export function buildImportReport({ rawTotal, filteredTotal, products, duplicateGroups }) {
  const byCategory = products.reduce((accumulator, product) => {
    accumulator[product.categorySlug] = (accumulator[product.categorySlug] || 0) + 1;
    return accumulator;
  }, {});

  const missingImage = products.filter((product) => !product.image).length;
  const missingSpecs = products.filter(
    (product) => (!product.specs || product.specs.length === 0) && (!product.technical_specifications || Object.keys(product.technical_specifications).length === 0),
  ).length;

  return {
    rawTotal,
    filteredTotal,
    importedTotal: products.length,
    duplicateTotal: duplicateGroups.length,
    byCategory,
    missingImage,
    missingSpecs,
    sample: products.slice(0, 5).map((product) => ({
      slug: product.slug,
      productGroup: product.productGroup,
      categorySlug: product.categorySlug,
      image: product.image,
      specs: product.specs.length,
      technicalSections: Object.keys(product.technical_specifications || {}).length,
    })),
  };
}
