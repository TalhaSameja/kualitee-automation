import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: 1, // Set to 1 for clearer debugging logs
  reporter: [
    ['html'],
    ['json', { outputFile: './json-report/report.json' }]
  ],
  
  use: {
    // 1. Run only on Desktop Chrome by default
    ...devices['Desktop Chrome'], 
    trace: 'on-first-retry',
    headless: !!process.env.CI, // Headed locally for debugging, headless in CI
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'] },
    },
    // We comment these out to save time. Uncomment when you need full regression.
    // { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    // { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});