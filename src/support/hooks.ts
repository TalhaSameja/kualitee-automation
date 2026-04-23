import 'dotenv/config';
import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, Status } from '@cucumber/cucumber';
import { chromium, firefox, webkit, Browser, Page, BrowserContext } from '@playwright/test';
import { remote } from 'webdriverio';
import { appiumConfig } from '../../config/appium.config';
import { ENV } from '../config/environments';
import { takeScreenshot } from '../pages/web/common/WebHelpers';
import { takeMobileScreenshot } from '../pages/mobile/common/MobileHelpers';

setDefaultTimeout(60 * 1000);

// Playwright global objects
let browser: Browser;
let context: BrowserContext;
export let page: Page;

// WebdriverIO global object
export let driver: WebdriverIO.Browser;

BeforeAll({ timeout: 120 * 1000 }, async () => {
    const platform = process.env.PLATFORM || 'web';
    console.log(`[Hooks] Platform: ${platform} | Environment: ${ENV.name}`);
    console.log(`[Hooks] Base URL: ${ENV.baseUrl}`);

    if (platform === 'web') {
        const browserType = process.env.BROWSER || 'chrome';

        const launchOptions = {
            headless: ENV.isCI ? true : false,
            args: (browserType === 'chrome' && !ENV.isCI) ? ['--start-maximized'] : []
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
            const screenshotName = scenario.pickle.name.replace(/[^a-z0-9]/gi, '_');
            const screenshot = await takeScreenshot(page, screenshotName);
            this.attach(screenshot, 'image/png');
        }
        await page.close();
        await context.close();
    } else if (platform === 'mobile' && driver) {
        if (scenario.result?.status === Status.FAILED) {
            const screenshotName = scenario.pickle.name.replace(/[^a-z0-9]/gi, '_');
            const screenshot = await takeMobileScreenshot(driver, screenshotName);
            this.attach(Buffer.from(screenshot, 'base64'), 'image/png');
        }
    }
});
