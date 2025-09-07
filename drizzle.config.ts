import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'postgresql',
  out: './migrations',
  schema: './server/schema.ts',
  dbCredentials: {
    url: process.env.DATABASE_URL || ''
  },
  strict: true,
  verbose: true
});
