import { buildConfig } from 'payload'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path';
import { fileURLToPath } from 'url';

import { Users } from './collections/Users';
import { Media } from './collections/Media';
import { Categories } from './collections/Categories';
import { Products } from './collections/Products';
import { Banners } from './collections/Banners';
import { Customers } from './collections/Customers';
import { Orders } from './collections/Orders';
import { Carts } from './collections/Carts';
import { Posts } from './collections/Posts';
import { Pages } from './collections/Pages';

import { SiteSettings } from './globals/SiteSettings';
import { Promotions } from './globals/Promotions';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: ' — Điện Tử Thụy Chi Admin',
    },
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
  secret: process.env.PAYLOAD_SECRET || 'ba4c9d7a2b3c4d5e6f7a8b9c0d1e2f3a',
  db: mongooseAdapter({
    url: process.env.MONGODB_URI,
  }),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
});
