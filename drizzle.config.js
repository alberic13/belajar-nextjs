import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/lib/schema.js',
  dialect: 'mysql',
  dbCredentials: {
    url: 'mysql://root@127.0.0.1:3306/test1',
  },
});
