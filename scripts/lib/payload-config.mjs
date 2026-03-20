import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { buildConfig } from 'payload';
import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import sharp from 'sharp';

import { Media } from '../../src/collections/Media.js';
import { Categories } from '../../src/collections/Categories.js';
import { Products } from '../../src/collections/Products.js';
import { Banners } from '../../src/collections/Banners.js';
import { Pages } from '../../src/collections/Pages.js';
import { Posts } from '../../src/collections/Posts.js';
import { SiteSettings } from '../../src/globals/SiteSettings.js';
import { Promotions } from '../../src/globals/Promotions.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const projectRoot = path.resolve(dirname, '../..');

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmed.slice(0, separatorIndex).trim();
    let value = trimmed.slice(separatorIndex + 1).trim();

    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  }
}

loadDotEnv(path.join(projectRoot, '.env'));

const config = buildConfig({
  collections: [Media, Categories, Products, Banners, Pages, Posts],
  globals: [SiteSettings, Promotions],
  editor: lexicalEditor({}),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET || 'ba4c9d7a2b3c4d5e6f7a8b9c0d1e2f3a',
  sharp,
  db: mongooseAdapter({
    url: process.env.MONGODB_URI,
  }),
  typescript: {
    outputFile: path.resolve(dirname, '../../src/payload-types.ts'),
  },
});

export default config;
