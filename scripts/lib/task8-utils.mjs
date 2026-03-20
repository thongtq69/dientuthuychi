import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

import { products as giakhoProducts } from '../../src/data/giakhoData.js';
import { nonApplePhonesProducts } from '../../src/data/nonApplePhonesData.js';
import { nonAppleTabletsProducts } from '../../src/data/nonAppleTabletsData.js';

import { bannerSources } from './banner-sources.mjs';
import { dedupeProducts } from './product-dedup.mjs';
import { getPayloadClient, destroyPayloadClient } from './payload-client.mjs';
import { toTask1Product } from './product-mappers.mjs';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export const projectRoot = path.resolve(dirname, '../..');
export const reportsDir = path.join(projectRoot, 'scripts', 'reports');
export const websiteAppDir = path.join(projectRoot, 'src', 'app', '(website)');
export const componentsDir = path.join(projectRoot, 'src', 'components');
export const pagesJsonDir = path.join(projectRoot, 'pages-json');

const codeExtensions = new Set(['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs']);
const productSources = [
  ['giakho', giakhoProducts],
  ['nonApplePhones', nonApplePhonesProducts],
  ['nonAppleTablets', nonAppleTabletsProducts],
];

async function walk(dirPath, predicate = () => true) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath, predicate)));
      continue;
    }

    if (predicate(fullPath)) {
      files.push(fullPath);
    }
  }

  return files;
}

function buildLocalProducts() {
  const normalized = [];

  for (const [sourceName, products] of productSources) {
    for (const product of products) {
      const normalizedProduct = toTask1Product(product, sourceName);
      if (normalizedProduct) {
        normalized.push(normalizedProduct);
      }
    }
  }

  return dedupeProducts(normalized).products;
}

export function getLocalProductSnapshot() {
  const localProducts = buildLocalProducts();
  const bySlug = new Map(localProducts.map((product) => [product.slug, product]));
  const byCategory = localProducts.reduce((accumulator, product) => {
    const key = product.categorySlug || 'uncategorized';
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  return {
    count: localProducts.length,
    slugs: [...bySlug.keys()].sort(),
    bySlug,
    byCategory,
  };
}

export function getLocalBannerSnapshot() {
  const slugs = bannerSources.map((banner) => banner.slug).sort();
  const byPosition = bannerSources.reduce((accumulator, banner) => {
    const key = banner.position || 'unknown';
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  return {
    count: bannerSources.length,
    slugs,
    byPosition,
  };
}

function normalizePageSlugFromUrl(url) {
  const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, '');
  return pathname || 'home';
}

export async function getLocalPageSnapshot() {
  const files = await walk(pagesJsonDir, (filePath) => path.extname(filePath) === '.json');
  const pages = [];

  for (const filePath of files) {
    const raw = await fs.readFile(filePath, 'utf8');
    const page = JSON.parse(raw);
    if (page.page_type !== 'content' || page.normalized_product) {
      continue;
    }

    const slug = normalizePageSlugFromUrl(page.url)
    const firstSegment = slug.split('/')[0]

    if (!slug || slug === 'home' || slug === 'cart' || slug === 'cart-installment' || firstSegment?.startsWith('test-')) {
      continue
    }

    pages.push({
      slug,
      url: page.url,
      title: page.title || null,
    });
  }

  const uniquePages = Array.from(new Map(pages.map((page) => [page.slug, page])).values());

  return {
    count: uniquePages.length,
    slugs: uniquePages.map((page) => page.slug).sort(),
    pages: uniquePages,
  };
}

export function getLocalPostSnapshot() {
  const localPosts = extractLiteralExportFromFile(path.join(projectRoot, 'src', 'data', 'siteData.js'), 'blogPosts');

  return {
    count: localPosts.length,
    slugs: localPosts.map((post) => post.slug).sort(),
    bySlug: new Map(localPosts.map((post) => [post.slug, post])),
  };
}

function extractLiteralExportFromFile(filePath, exportName) {
  const source = requireTextSync(filePath);
  const marker = `export const ${exportName} =`;
  const startIndex = source.indexOf(marker);
  if (startIndex === -1) {
    return [];
  }

  const valueStart = source.indexOf('[', startIndex);
  if (valueStart === -1) {
    return [];
  }

  let depth = 0;
  let inString = false;
  let stringChar = '';
  let escaped = false;

  for (let index = valueStart; index < source.length; index += 1) {
    const character = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === '\\') {
        escaped = true;
      } else if (character === stringChar) {
        inString = false;
        stringChar = '';
      }
      continue;
    }

    if (character === '"' || character === "'" || character === '`') {
      inString = true;
      stringChar = character;
      continue;
    }

    if (character === '[') {
      depth += 1;
    } else if (character === ']') {
      depth -= 1;
      if (depth === 0) {
        const literal = source.slice(valueStart, index + 1);
        return Function(`return (${literal});`)();
      }
    }
  }

  return [];
}

function requireTextSync(filePath) {
  return readFileCache.get(filePath) || '';
}

const readFileCache = new Map();

for (const filePath of [path.join(projectRoot, 'src', 'data', 'siteData.js')]) {
  readFileCache.set(filePath, await fs.readFile(filePath, 'utf8'));
}

async function fetchAllDocs(payload, collection, select = undefined) {
  const docs = [];
  let page = 1;
  let hasNextPage = true;

  while (hasNextPage) {
    const result = await payload.find({
      collection,
      depth: 0,
      limit: 200,
      overrideAccess: true,
      page,
      pagination: true,
      select,
    });

    docs.push(...result.docs);
    hasNextPage = result.hasNextPage;
    page += 1;
  }

  return docs;
}

export async function getPayloadSnapshot() {
  let payload;

  try {
    payload = await getPayloadClient();

    const [products, banners, pages, posts] = await Promise.all([
      fetchAllDocs(payload, 'products', {
        slug: true,
        categorySlug: true,
        image: true,
        mainImage: true,
        gallery: true,
        specs: true,
        technical_specifications: true,
        variants: true,
      }),
      fetchAllDocs(payload, 'banners', { slug: true, position: true, image: true, mobileImage: true }),
      fetchAllDocs(payload, 'pages', { slug: true, routePath: true }),
      fetchAllDocs(payload, 'posts', { slug: true }),
    ]);

    return {
      ok: true,
      products,
      banners,
      pages,
      posts,
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message,
      products: [],
      banners: [],
      pages: [],
      posts: [],
    };
  } finally {
    if (payload) {
      await destroyPayloadClient();
    }
  }
}

export function summarizePayloadProducts(products) {
  const byCategory = products.reduce((accumulator, product) => {
    const key = product.categorySlug || 'uncategorized';
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  return {
    count: products.length,
    slugs: products.map((product) => product.slug).filter(Boolean).sort(),
    bySlug: new Map(products.map((product) => [product.slug, product])),
    byCategory,
  };
}

export function summarizePayloadBanners(banners) {
  const byPosition = banners.reduce((accumulator, banner) => {
    const key = banner.position || 'unknown';
    accumulator[key] = (accumulator[key] || 0) + 1;
    return accumulator;
  }, {});

  return {
    count: banners.length,
    slugs: banners.map((banner) => banner.slug).filter(Boolean).sort(),
    byPosition,
  };
}

export function summarizePayloadContent(docs) {
  const resolvedSlugs = docs.map((doc) => doc.routePath || doc.slug).filter(Boolean)
  return {
    count: docs.length,
    slugs: resolvedSlugs.sort(),
    bySlug: new Map(docs.map((doc) => [doc.routePath || doc.slug, doc])),
  };
}

export function compareSlugSets(localSlugs, payloadSlugs, limit = 25) {
  const localSet = new Set(localSlugs);
  const payloadSet = new Set(payloadSlugs);

  return {
    localOnly: localSlugs.filter((slug) => !payloadSet.has(slug)).slice(0, limit),
    payloadOnly: payloadSlugs.filter((slug) => !localSet.has(slug)).slice(0, limit),
    matched: localSlugs.filter((slug) => payloadSet.has(slug)).length,
  };
}

export function compareProductIntegrity(localSnapshot, payloadSnapshot, limit = 25) {
  const mismatches = [];

  for (const [slug, localProduct] of localSnapshot.bySlug.entries()) {
    const payloadProduct = payloadSnapshot.bySlug.get(slug);
    if (!payloadProduct) {
      continue;
    }

    const localHasImage = Boolean(localProduct.image);
    const payloadHasImage = Boolean(payloadProduct.image || payloadProduct.mainImage);
    const localHasSpecs = Array.isArray(localProduct.specs)
      ? localProduct.specs.length > 0
      : Boolean(localProduct.technical_specifications && Object.keys(localProduct.technical_specifications).length > 0);
    const payloadHasSpecs = Array.isArray(payloadProduct.specs)
      ? payloadProduct.specs.length > 0
      : Boolean(payloadProduct.technical_specifications && Object.keys(payloadProduct.technical_specifications).length > 0);
    const localVariantCount = Array.isArray(localProduct.variants) ? localProduct.variants.length : 0;
    const payloadVariantCount = Array.isArray(payloadProduct.variants) ? payloadProduct.variants.length : 0;
    const localGalleryCount = Array.isArray(localProduct.gallery) ? localProduct.gallery.length : 0;
    const payloadGalleryCount = Array.isArray(payloadProduct.gallery) ? payloadProduct.gallery.length : 0;

    if (
      (localHasImage && !payloadHasImage) ||
      (localHasSpecs && !payloadHasSpecs) ||
      payloadVariantCount < localVariantCount ||
      (localGalleryCount > 0 && payloadGalleryCount === 0)
    ) {
      mismatches.push({
        slug,
        local: {
          hasImage: localHasImage,
          hasSpecs: localHasSpecs,
          variantCount: localVariantCount,
          galleryCount: localGalleryCount,
        },
        payload: {
          hasImage: payloadHasImage,
          hasSpecs: payloadHasSpecs,
          variantCount: payloadVariantCount,
          galleryCount: payloadGalleryCount,
        },
      });
    }
  }

  return {
    checked: localSnapshot.count,
    mismatches: mismatches.slice(0, limit),
    mismatchCount: mismatches.length,
  };
}

export function compareBreakdown(localBreakdown, payloadBreakdown) {
  const keys = Array.from(new Set([...Object.keys(localBreakdown), ...Object.keys(payloadBreakdown)])).sort();

  return keys.map((key) => ({
    key,
    local: localBreakdown[key] || 0,
    payload: payloadBreakdown[key] || 0,
    delta: (payloadBreakdown[key] || 0) - (localBreakdown[key] || 0),
  }));
}

function parseImports(code) {
  const importRegex = /import\s+(?:[^'";]+?\s+from\s+)?['"]([^'"]+)['"]/g;
  const imports = [];
  let match;

  while ((match = importRegex.exec(code)) !== null) {
    imports.push(match[1]);
  }

  return imports;
}

function toPosixPath(filePath) {
  return filePath.split(path.sep).join('/');
}

function isDataImport(specifier) {
  return specifier.startsWith('@/data/') || specifier.includes('/src/data/') || /^\.\.?(\/.*)?data\//.test(specifier);
}

function resolveLocalImport(specifier, fromFile) {
  if (!specifier.startsWith('.') && !specifier.startsWith('@/')) {
    return null;
  }

  let basePath;
  if (specifier.startsWith('@/')) {
    basePath = path.join(projectRoot, 'src', specifier.slice(2));
  } else {
    basePath = path.resolve(path.dirname(fromFile), specifier);
  }

  const candidates = [];
  const ext = path.extname(basePath);
  if (ext) {
    candidates.push(basePath);
  } else {
    for (const extension of codeExtensions) {
      candidates.push(`${basePath}${extension}`);
    }
    for (const extension of codeExtensions) {
      candidates.push(path.join(basePath, `index${extension}`));
    }
  }

  return candidates;
}

function routePathFromFile(filePath) {
  const relativePath = path.relative(websiteAppDir, filePath);
  const withoutPage = relativePath.replace(/(^|\/)page\.[^.]+$/, '');
  const routePath = withoutPage
    .split(path.sep)
    .filter((segment) => segment && !segment.startsWith('('))
    .join('/');

  if (!routePath) {
    return '/';
  }

  return `/${routePath}`.replace(/\/+/g, '/').replace(/\/$/, '');
}

export async function auditDirectDataRoutes() {
  const projectFiles = [
    ...(await walk(websiteAppDir, (filePath) => codeExtensions.has(path.extname(filePath)))),
    ...(await walk(componentsDir, (filePath) => codeExtensions.has(path.extname(filePath)))),
  ];

  const directDataModules = new Set();
  const graph = new Map();

  for (const filePath of projectFiles) {
    const source = await fs.readFile(filePath, 'utf8');
    const imports = parseImports(source);
    const resolvedImports = [];

    for (const specifier of imports) {
      if (isDataImport(specifier)) {
        directDataModules.add(filePath);
        continue;
      }

      const candidates = resolveLocalImport(specifier, filePath);
      if (!candidates) {
        continue;
      }

      for (const candidate of candidates) {
        try {
          const stats = await fs.stat(candidate);
          if (stats.isFile()) {
            resolvedImports.push(candidate);
            break;
          }
        } catch {
          continue;
        }
      }
    }

    graph.set(filePath, resolvedImports);
  }

  const routeFiles = projectFiles.filter((filePath) => /\/page\.[^.]+$/.test(filePath));
  const routes = [];

  for (const routeFile of routeFiles) {
    const stack = [routeFile];
    const visited = new Set();
    const dataModules = new Set();

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current || visited.has(current)) {
        continue;
      }
      visited.add(current);

      if (directDataModules.has(current)) {
        dataModules.add(current);
      }

      for (const dependency of graph.get(current) || []) {
        stack.push(dependency);
      }
    }

    if (dataModules.size === 0) {
      continue;
    }

    routes.push({
      route: routePathFromFile(routeFile),
      file: toPosixPath(path.relative(projectRoot, routeFile)),
      dataModules: [...dataModules]
        .map((modulePath) => toPosixPath(path.relative(projectRoot, modulePath)))
        .sort(),
    });
  }

  return {
    directDataModules: [...directDataModules]
      .map((modulePath) => toPosixPath(path.relative(projectRoot, modulePath)))
      .sort(),
    routes: routes.sort((left, right) => left.route.localeCompare(right.route)),
  };
}

export async function ensureReportsDir() {
  await fs.mkdir(reportsDir, { recursive: true });
}
