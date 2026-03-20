import crypto from 'crypto';
import fs from 'fs/promises';
import os from 'os';
import path from 'path';

const PUBLIC_HOST = 'https://dienthoaigiakho.vn';
const INVALID_PRODUCT_IMAGE_PATTERN = /(via\.placeholder\.com\/300x300|\/km_product\d+\.png)/i;
const UI_ASSET_PATTERN = /(icon|logo|home-credit|kredivo|warranty|warehouse|hero-badge|coupon|payment|he-thong|gio-hang|menu-bar|thong-tin|hot\.svg|shield|badge|back-ground|u-u-dai|giakho|facebook|youtube|tiktok|zalo|messenger|instagram|authentic|instalment|fast-delivery|free-return|align-price|breadcrumb|clock|delivery)/i;

export function createReport() {
  return {
    totals: {
      mediaCreated: 0,
      mediaReused: 0,
      productMatched: 0,
      productUpdated: 0,
      productMissing: 0,
      bannerMatched: 0,
      bannerCreated: 0,
      bannerUpdated: 0,
    },
    missingImageSources: [],
    brokenMappings: [],
    missingProducts: [],
    missingBanners: [],
    bannerPositions: {},
    sampleChecks: [],
  };
}

export function shouldSkipProductImage(source) {
  if (!source) {
    return true;
  }

  return INVALID_PRODUCT_IMAGE_PATTERN.test(source) || UI_ASSET_PATTERN.test(source);
}

export function uniqueList(values) {
  return [...new Set(values.filter(Boolean))];
}

export function normalizeSource(source) {
  if (!source) {
    return null;
  }

  if (source.startsWith('http://') || source.startsWith('https://')) {
    return source.replace(/^http:\/\//i, 'https://');
  }

  if (source.startsWith('/')) {
    return `${PUBLIC_HOST}${source}`;
  }

  return `${PUBLIC_HOST}/${source.replace(/^\/+/, '')}`;
}

export function getStableFilename(source) {
  const normalized = normalizeSource(source);
  const parsed = new URL(normalized);
  const extension = path.extname(parsed.pathname) || '.jpg';
  const basename = path.basename(parsed.pathname, extension) || 'media';
  const safeBasename = basename.toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '') || 'media';
  const hash = crypto.createHash('sha1').update(normalized).digest('hex').slice(0, 12);

  return `${safeBasename}-${hash}${extension.toLowerCase()}`;
}

function getLocalFilePath(projectRoot, source) {
  const normalized = normalizeSource(source);
  if (!normalized) {
    return null;
  }

  const parsed = new URL(normalized);

  if (parsed.hostname !== 'dienthoaigiakho.vn') {
    return null;
  }

  return path.join(projectRoot, 'public', parsed.pathname.replace(/^\/+/, ''));
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureTempDir(prefix) {
  return fs.mkdtemp(path.join(os.tmpdir(), prefix));
}

export async function materializeSource(source, projectRoot, tempDir) {
  const normalized = normalizeSource(source);
  if (!normalized) {
    throw new Error('Missing source');
  }

  const filename = getStableFilename(normalized);
  const destination = path.join(tempDir, filename);
  const localPath = getLocalFilePath(projectRoot, normalized);

  if (localPath && await fileExists(localPath)) {
    await fs.copyFile(localPath, destination);
    return { filePath: destination, normalizedSource: normalized };
  }

  const response = await fetch(normalized, {
    headers: {
      'user-agent': 'task-3-media-import/1.0',
    },
  });

  if (!response.ok) {
    throw new Error(`Fetch failed with status ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  await fs.writeFile(destination, Buffer.from(arrayBuffer));

  return { filePath: destination, normalizedSource: normalized };
}

export async function upsertMedia(payload, source, options = {}) {
  const { alt, projectRoot, report, tempDir } = options;
  const normalizedSource = normalizeSource(source);

  if (!normalizedSource) {
    report?.missingImageSources.push({ source, reason: 'empty-source' });
    return null;
  }

  const filename = getStableFilename(normalizedSource);
  const existing = await payload.find({
    collection: 'media',
    depth: 0,
    limit: 1,
    overrideAccess: true,
    pagination: false,
    where: {
      filename: {
        equals: filename,
      },
    },
  });

  if (existing.docs.length > 0) {
    if (report) {
      report.totals.mediaReused += 1;
    }
    return existing.docs[0];
  }

  const materialized = await materializeSource(normalizedSource, projectRoot, tempDir);
  const created = await payload.create({
    collection: 'media',
    data: {
      alt: alt || path.basename(filename, path.extname(filename)),
      externalURL: normalizedSource,
    },
    filePath: materialized.filePath,
    overrideAccess: true,
    context: {
      skipCloudinarySync: true,
    },
  });

  if (report) {
    report.totals.mediaCreated += 1;
  }

  return created;
}

export async function writeReport(reportPath, report) {
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
}
