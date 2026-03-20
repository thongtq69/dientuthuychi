import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import sharp from 'sharp'
import path from 'path';
import { fileURLToPath } from 'url';

import { Users } from './collections/Users.js';
import { Media } from './collections/Media.js';
import { Categories } from './collections/Categories.js';
import { Products } from './collections/Products.js';
import { Banners } from './collections/Banners.js';
import { Customers } from './collections/Customers.js';
import { Orders } from './collections/Orders.js';
import { Carts } from './collections/Carts.js';
import { Posts } from './collections/Posts.js';
import { Pages } from './collections/Pages.js';

import { SiteSettings } from './globals/SiteSettings.js';
import { Promotions } from './globals/Promotions.js';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: 'users',
    meta: {
      titleSuffix: ' — Điện Tử Thụy Chi Admin',
    },
  },
  routes: {
    admin: '/admin',
  },
  collections: [
    Users, 
    Customers, 
    Media, 
    Categories, 
    Products, 
    Banners, 
    Orders, 
    Carts, 
    Posts, 
    Pages
  ],
  globals: [
    SiteSettings,
    Promotions
  ],
  editor: lexicalEditor({}),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
  secret: process.env.PAYLOAD_SECRET || 'ba4c9d7a2b3c4d5e6f7a8b9c0d1e2f3a',
  sharp,
  db: mongooseAdapter({
    url: process.env.MONGODB_URI,
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
