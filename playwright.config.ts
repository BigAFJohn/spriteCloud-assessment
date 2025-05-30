import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: true,
    actionTimeout: 0,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    video: process.env.RECORD_VIDEO === 'true' ? 'on' : 'off',
    trace: 'on-first-retry',
  },
  timeout: 60 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  outputDir: 'test-results/artifacts',
});