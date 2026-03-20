import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  retries: 0,
  workers: 1, // Set to 1 for clearer debugging logs
  reporter: 'html',
  
  use: {
    // 1. Run only on Desktop Chrome by default
    ...devices['Desktop Chrome'], 
    trace: 'on-first-retry',
    headless: false, // Keep browser visible so you can see what happens
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