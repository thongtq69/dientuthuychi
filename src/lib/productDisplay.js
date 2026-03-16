export function sanitizeProductName(name) {
  if (typeof name !== 'string' || !name.trim()) {
    return name;
  }

  return name
    .replace(/\b(?:like\s*new|likenew)\b/gi, '')
    .replace(/\(\s*\)/g, '')
    .replace(/^\s*[-|/]\s*/g, '')
    .replace(/\s*[-|/]\s*$/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.)])/g, '$1')
    .trim();
}
