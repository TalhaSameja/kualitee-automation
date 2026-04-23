import { Page, Locator } from '@playwright/test';
import { retry } from '../../../common/CommonUtils';
import fs from 'fs';
import path from 'path';

/**
 * Web Helpers
 * 
 * Common Playwright utility methods shared across all web page objects.
 * Encapsulates repeated patterns like safe click, safe fill,
 * wait for page load, and screenshot capture.
 */

/**
 * Wait for page to fully load (network idle + DOM content loaded).
 */
export async function waitForPageLoad(page: Page, timeout: number = 15000): Promise<void> {
    await page.waitForLoadState('domcontentloaded', { timeout });
    await page.waitForLoadState('networkidle', { timeout }).catch(() => {
        // networkidle can sometimes timeout on heavy pages — don't fail the test
        console.warn('[WebHelpers] networkidle timed out, proceeding anyway');
    });
}

/**
 * Safe click with auto-retry on element interception.
 * Handles cases where overlays or animations block clicks.
 * 
 * @param locator - Playwright Locator to click
 * @param options - Optional click options
 */
export async function safeClick(
    locator: Locator,
    options?: { force?: boolean; timeout?: number }
): Promise<void> {
    const timeout = options?.timeout || 10000;

    await retry(async () => {
        await locator.waitFor({ state: 'visible', timeout });
        await locator.click({ force: options?.force || false });
    }, 3, 500);
}

/**
 * Safe fill: click → clear → fill pattern.
 * Handles pre-filled fields and Angular-style read-only masks.
 * 
 * @param locator - Playwright Locator for the input field
 * @param value - Value to fill
 */
export async function safeFill(locator: Locator, value: string): Promise<void> {
    await locator.click({ force: true });
    await locator.clear();
    await locator.fill(value);
}

/**
 * Scroll to an element if it's not in the viewport.
 */
export async function scrollToElement(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
}

/**
 * Take a screenshot and save it to the test-results directory.
 * 
 * @param page - Playwright Page instance
 * @param name - Screenshot file name (without extension)
 * @returns Buffer of the screenshot
 */
export async function takeScreenshot(
    page: Page,
    name: string
): Promise<Buffer> {
    const safeName = name.replace(/[^a-z0-9]/gi, '_');
    const screenshotDir = path.join('test-results', 'screenshots');

    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const screenshotPath = path.join(screenshotDir, `${safeName}.png`);
    const buffer = await page.screenshot({ path: screenshotPath, fullPage: true });

    console.log(`[WebHelpers] Screenshot saved: ${screenshotPath}`);
    return buffer;
}

/**
 * Wait for a specific URL pattern to appear.
 * Useful for verifying navigation after login or form submission.
 */
export async function waitForUrlContaining(
    page: Page,
    urlFragment: string,
    timeout: number = 15000
): Promise<void> {
    await page.waitForURL(`**/*${urlFragment}*`, { timeout });
}
