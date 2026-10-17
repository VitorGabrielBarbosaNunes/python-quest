import { defineConfig } from 'vite';
import { siteBase } from './config/site-base.js';
export default defineConfig({
  base: siteBase(process.env.PAGES_BASE_PATH),
  build: { rollupOptions: { output: { manualChunks: { phaser: ['phaser'] } } } },
  test: { include: ['tests/**/*.test.js'], testTimeout: 30000 },
});
