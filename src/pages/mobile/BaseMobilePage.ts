import { ENV } from '../../config/environments';
import { setValueSafe, tapElement, swipe, takeMobileScreenshot, waitForElement } from './common/MobileHelpers';
import { delay } from '../../common/CommonUtils';

/**
 * Base Mobile Page
 * 
 * Abstract base class for all mobile page objects.
 * Provides common navigation, driver management,
 * and convenience wrappers for MobileHelpers.
 * 
 * All mobile page objects should extend this class.
 */
export abstract class BaseMobilePage {
    protected driver: WebdriverIO.Browser;

    constructor(driver: WebdriverIO.Browser) {
        this.driver = driver;
    }

    /**
     * Navigate to a path relative to the mobile base URL.
     * If no path is provided, navigates to the base URL root.
     */
    async navigate(path: string = ''): Promise<void> {
        const url = `${ENV.mobileBaseUrl}${path}`;
        console.log(`[BaseMobilePage] Navigating to: ${url}`);
        await this.driver.url(url);
        console.log('[BaseMobilePage] Navigation sent. Waiting for load...');
        await delay(10000);
    }

    /**
     * Get the current page/app URL.
     */
    async getCurrentUrl(): Promise<string> {
        return this.driver.getUrl();
    }

    // ── Convenience Wrappers ────────────────────────────────

    /**
     * Wait for an element to be displayed.
     */
    protected async waitFor(selector: string, timeout?: number): Promise<WebdriverIO.Element> {
        return waitForElement(this.driver, selector, timeout);
    }

    /**
     * Safe setValue with JS fallback for mobile.
     */
    protected async safeSetValue(element: any, value: string): Promise<void> {
        await setValueSafe(this.driver, element, value);
    }

    /**
     * Safe tap/click with JS fallback.
     */
    protected async safeTap(element: any): Promise<void> {
        await tapElement(this.driver, element);
    }

    /**
     * Swipe in a direction.
     */
    protected async swipe(direction: 'up' | 'down' | 'left' | 'right', percentage?: number): Promise<void> {
        await swipe(this.driver, direction, percentage);
    }

    /**
     * Take a mobile screenshot.
     */
    protected async screenshot(name: string): Promise<string> {
        return takeMobileScreenshot(this.driver, name);
    }
}
