import { retry, delay } from '../../../common/CommonUtils';
import fs from 'fs';
import path from 'path';

/**
 * Mobile Helpers
 * 
 * Common Appium/WebdriverIO utility methods shared across
 * all mobile page objects. Encapsulates repeated patterns
 * like safe tap, safe setValue, swipe, and screenshot capture.
 */

/**
 * Wait for an element to be displayed on screen.
 * 
 * @param driver - WebdriverIO Browser instance
 * @param selector - Element selector string
 * @param timeout - Max wait time in ms (default: 30000)
 */
export async function waitForElement(
    driver: WebdriverIO.Browser,
    selector: string,
    timeout: number = 30000
): Promise<any> {
    const element = await driver.$(selector);
    await element.waitForDisplayed({ timeout });
    return element;
}

/**
 * Set value on a mobile element with JS fallback.
 * Handles cases where standard setValue fails silently on mobile browsers.
 * 
 * @param driver - WebdriverIO Browser instance
 * @param element - The element or element promise to set value on
 * @param value - The value to set
 */
export async function setValueSafe(
    driver: WebdriverIO.Browser,
    element: any,
    value: string
): Promise<void> {
    const el = await element;
    try {
        await el.click();
        await el.setValue(value);

        // Verify value was actually set (mobile browsers can fail silently)
        const currentValue = await el.getValue();
        if (currentValue !== value) {
            throw new Error(`Standard setValue failed. Got: ${currentValue}`);
        }
    } catch (error) {
        console.log(
            `[MobileHelpers] Standard input failed, using execute fallback: ${error instanceof Error ? error.message : String(error)}`
        );
        await driver.execute(
            `arguments[0].value = arguments[1];
             arguments[0].dispatchEvent(new Event("input", { bubbles: true }));
             arguments[0].dispatchEvent(new Event("change", { bubbles: true }));
             arguments[0].dispatchEvent(new Event("blur", { bubbles: true }));`,
            el,
            value
        );
    }
}

/**
 * Tap/click an element with JS fallback.
 * Handles cases where standard click is intercepted on mobile.
 * 
 * @param driver - WebdriverIO Browser instance
 * @param element - The element or element promise to tap
 */
export async function tapElement(
    driver: WebdriverIO.Browser,
    element: any
): Promise<void> {
    const el = await element;
    try {
        await el.waitForClickable({ timeout: 45000 });
        await el.click();
    } catch (error) {
        console.log(
            `[MobileHelpers] Standard click failed, using execute fallback: ${error instanceof Error ? error.message : String(error)}`
        );
        await driver.execute('arguments[0].click();', el);
    }
}

/**
 * Swipe in a direction on the screen.
 * Useful for scrolling through native app views.
 * 
 * @param driver - WebdriverIO Browser instance
 * @param direction - Swipe direction ('up' | 'down' | 'left' | 'right')
 * @param percentage - Swipe distance as percentage of screen (default: 0.5)
 */
export async function swipe(
    driver: WebdriverIO.Browser,
    direction: 'up' | 'down' | 'left' | 'right',
    percentage: number = 0.5
): Promise<void> {
    const { width, height } = await driver.getWindowSize();
    const centerX = width / 2;
    const centerY = height / 2;

    const swipeDistance = {
        up: { startX: centerX, startY: centerY + (height * percentage / 2), endX: centerX, endY: centerY - (height * percentage / 2) },
        down: { startX: centerX, startY: centerY - (height * percentage / 2), endX: centerX, endY: centerY + (height * percentage / 2) },
        left: { startX: centerX + (width * percentage / 2), startY: centerY, endX: centerX - (width * percentage / 2), endY: centerY },
        right: { startX: centerX - (width * percentage / 2), startY: centerY, endX: centerX + (width * percentage / 2), endY: centerY },
    };

    const { startX, startY, endX, endY } = swipeDistance[direction];

    await driver.performActions([
        {
            type: 'pointer',
            id: 'finger1',
            parameters: { pointerType: 'touch' },
            actions: [
                { type: 'pointerMove', duration: 0, x: Math.round(startX), y: Math.round(startY) },
                { type: 'pointerDown', button: 0 },
                { type: 'pause', duration: 100 },
                { type: 'pointerMove', duration: 300, x: Math.round(endX), y: Math.round(endY) },
                { type: 'pointerUp', button: 0 },
            ],
        },
    ]);

    await driver.releaseActions();
}

/**
 * Take a mobile screenshot and save it.
 * 
 * @param driver - WebdriverIO Browser instance
 * @param name - Screenshot file name (without extension)
 * @returns Base64-encoded screenshot string
 */
export async function takeMobileScreenshot(
    driver: WebdriverIO.Browser,
    name: string
): Promise<string> {
    const safeName = name.replace(/[^a-z0-9]/gi, '_');
    const screenshotDir = path.join('test-results', 'screenshots', 'mobile');

    if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
    }

    const screenshot = await driver.takeScreenshot();
    const screenshotPath = path.join(screenshotDir, `${safeName}.png`);
    fs.writeFileSync(screenshotPath, screenshot, 'base64');

    console.log(`[MobileHelpers] Screenshot saved: ${screenshotPath}`);
    return screenshot;
}
