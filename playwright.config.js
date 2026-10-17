import { defineConfig } from '@playwright/test';
import { siteBase } from './config/site-base.js';
const baseURL = `http://127.0.0.1:4173${siteBase(process.env.PAGES_BASE_PATH)}`;
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  timeout: 60000,
  use: { baseURL, headless: true, trace: 'retain-on-failure' },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
  },
});
