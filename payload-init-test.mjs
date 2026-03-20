import { getPayload } from 'payload';
import config from './src/payload.config.js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

async function run() {
  try {
    console.log("Initializing Payload with config...");
    const p = await getPayload({ config });
    console.log("Payload initialized successfully!");
    const users = await p.find({
      collection: 'users',
    });
    console.log("Users found:", users.totalDocs);
    process.exit(0);
  } catch (err) {
    console.error("Payload initialization failed:", err);
    process.exit(1);
  }
}

run();
