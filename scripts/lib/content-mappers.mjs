function toTextNode(text) {
  return {
    type: 'text',
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text,
    version: 1,
  };
}

function toParagraphNode(text) {
  return {
    type: 'paragraph',
    format: '',
    indent: 0,
    version: 1,
    direction: null,
    children: [toTextNode(text)],
  };
}

export function toRichTextParagraphs(paragraphs) {
  const safeParagraphs = paragraphs.filter(Boolean);

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      version: 1,
      direction: null,
      children: safeParagraphs.length > 0 ? safeParagraphs.map(toParagraphNode) : [toParagraphNode('')],
    },
  };
}

export function normalizeSlug(value) {
  if (typeof value !== 'string') return '';

  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function getPathSegments(url) {
  const pathname = new URL(url).pathname.replace(/^\/+|\/+$/g, '');
  return pathname ? pathname.split('/').map((segment) => normalizeSlug(segment)).filter(Boolean) : [];
}

export function getPageSlugFromUrl(url) {
  const segments = getPathSegments(url);
  return segments.at(-1) || '';
}

export function toSummaryParagraphs(text, fallback = []) {
  if (typeof text !== 'string' || !text.trim()) {
    return fallback.filter(Boolean);
  }

  const paragraphs = text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-ZÀ-Ỵ])/u)
    .map((item) => item.trim())
    .filter(Boolean)
    .slice(0, 4);

  return paragraphs.length > 0 ? paragraphs : fallback.filter(Boolean);
}

export function parseVietnameseDate(value) {
  if (typeof value !== 'string') {
    return null;
  }

  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return null;
  }

  const [, day, month, year] = match;
  return new Date(`${year}-${month}-${day}T00:00:00.000Z`).toISOString();
}

export function mapPostCategory(category) {
  const normalized = normalizeSlug(category || '');

  if (normalized.includes('khuyen-mai')) return 'khuyen-mai';
  if (normalized.includes('review') || normalized.includes('danh-gia')) return 'review';
  if (normalized.includes('huong-dan') || normalized.includes('tu-van')) return 'huong-dan';
  return 'tin-tuc';
}
