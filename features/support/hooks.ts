import 'dotenv/config';
import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, Page, BrowserContext } from '@playwright/test';
import { remote } from 'webdriverio';
import { appiumConfig } from '../../config/appium.config';
import fs from 'fs';
import path from 'path';

setDefaultTimeout(60 * 1000);

// Playwright global objects
let browser: Browser;
let context: BrowserContext;
export let page: Page;

// WebdriverIO global object
export let driver: WebdriverIO.Browser;

BeforeAll({ timeout: 120 * 1000 }, async () => {
    const platform = process.env.PLATFORM || 'web';
    console.log(`Executing tests for platform: ${platform}`);

    if (platform === 'web') {
        const browserType = process.env.BROWSER || 'chrome';
        const isCI = process.env.CI === 'true';

        const launchOptions = {
            headless: isCI ? true : false,
            args: (browserType === 'chrome' && !isCI) ? ['--start-maximized'] : []
        };

        switch (browserType) {
            case 'firefox':
                browser = await firefox.launch(launchOptions);
                break;
            case 'webkit':
                browser = await webkit.launch(launchOptions);
                break;
            default:
                browser = await chromium.launch(launchOptions);
                break;
        }
    } else if (platform === 'mobile') {
        // Initialize Appium specifically for mobile testing
        driver = await remote(appiumConfig as any);
        // Bind to global to make it accessible to WDIO Page Objects easily
        (global as any).browser = driver;
    }
    // Note: If platform === 'api', we don't start any browser/driver at all!
});

AfterAll(async () => {
    const platform = process.env.PLATFORM || 'web';
    if (platform === 'web' && browser) {
        await browser.close();
    } else if (platform === 'mobile' && driver) {
        await driver.deleteSession();
    }
});

Before(async () => {
    const platform = process.env.PLATFORM || 'web';
    if (platform === 'web') {
        context = await browser.newContext({
            viewport: null
        });
        page = await context.newPage();
    }
});

After(async function (scenario) {
    const platform = process.env.PLATFORM || 'web';

    if (platform === 'web' && page) {
        if (scenario.result?.status === Status.FAILED) {
            const screenshot = await page.screenshot({ fullPage: true });
            this.attach(screenshot, 'image/png');

            const screenshotName = scenario.pickle.name.replace(/[^a-z0-9]/gi, '_');
            const screenshotPath = path.join('test-results', 'screenshots', `${screenshotName}.png`);

            const dir = path.dirname(screenshotPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            await page.screenshot({ path: screenshotPath, fullPage: true });
        }
        await page.close();
        await context.close();
    } else if (platform === 'mobile' && driver) {
        if (scenario.result?.status === Status.FAILED) {
            const screenshot = await driver.takeScreenshot();
            this.attach(Buffer.from(screenshot, 'base64'), 'image/png');
        }
    }
});