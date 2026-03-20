import fs from 'fs/promises';
import path from 'path';
import vm from 'vm';

const projectRoot = path.resolve(new URL('../..', import.meta.url).pathname);
const siteDataPath = path.join(projectRoot, 'src/data/siteData.js');

function findAssignmentStart(source, exportName) {
  const marker = `export const ${exportName} =`;
  const index = source.indexOf(marker);

  if (index === -1) {
    throw new Error(`Could not find export ${exportName} in src/data/siteData.js`);
  }

  return index + marker.length;
}

function extractLiteralExpression(source, exportName) {
  let cursor = findAssignmentStart(source, exportName);

  while (cursor < source.length && /\s/.test(source[cursor])) {
    cursor += 1;
  }

  const opener = source[cursor];
  const closer = opener === '[' ? ']' : '}';

  if (!['[', '{'].includes(opener)) {
    throw new Error(`Export ${exportName} is not a literal array/object`);
  }

  let depth = 0;
  let quote = null;
  let escaped = false;

  for (let index = cursor; index < source.length; index += 1) {
    const char = source[index];

    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === '\\') {
        escaped = true;
        continue;
      }

      if (char === quote) {
        quote = null;
      }

      continue;
    }

    if (char === '\'' || char === '"' || char === '`') {
      quote = char;
      continue;
    }

    if (char === opener) {
      depth += 1;
      continue;
    }

    if (char === closer) {
      depth -= 1;

      if (depth === 0) {
        return source.slice(cursor, index + 1);
      }
    }
  }

  throw new Error(`Could not parse export ${exportName}`);
}

function evaluateLiteral(expression, exportName) {
  return vm.runInNewContext(`(${expression})`, {}, { timeout: 1000, filename: `${exportName}.snapshot.js` });
}

export async function loadSiteDataSnapshot() {
  const source = await fs.readFile(siteDataPath, 'utf8');
  const exportNames = [
    'siteMeta',
    'storeLocations',
    'storeBenefits',
    'footerContactInfo',
    'socialLinks',
    'midPageBanners',
    'blogPosts',
  ];

  return Object.fromEntries(
    exportNames.map((exportName) => {
      const expression = extractLiteralExpression(source, exportName);
      return [exportName, evaluateLiteral(expression, exportName)];
    }),
  );
}
