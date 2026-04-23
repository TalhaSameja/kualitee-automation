import { Page, Locator } from '@playwright/test';
import { ENV } from '../../config/environments';
import { safeFill, safeClick, scrollToElement, waitForPageLoad } from './common/WebHelpers';

/**
 * Base Page
 * 
 * Abstract base class for all web page objects.
 * Provides common navigation, URL management, and
 * convenience wrappers for WebHelpers.
 * 
 * All web page objects should extend this class.
 */
export abstract class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Navigate to a path relative to the base URL.
     * If no path is provided, navigates to the base URL root.
     */
    async navigate(path: string = ''): Promise<void> {
        const url = `${ENV.baseUrl}${path}`;
        await this.page.goto(url);
        await waitForPageLoad(this.page);
    }

    /**
     * Get the current page URL.
     */
    async getCurrentUrl(): Promise<string> {
        return this.page.url();
    }

    /**
     * Get the current page title.
     */
    async getTitle(): Promise<string> {
        return this.page.title();
    }

    // ── Convenience Wrappers ────────────────────────────────

    /**
     * Safe fill: click → clear → fill pattern.
     */
    protected async safeFill(locator: Locator, value: string): Promise<void> {
        await safeFill(locator, value);
    }

    /**
     * Safe click with retry on element interception.
     */
    protected async safeClick(locator: Locator, options?: { force?: boolean; timeout?: number }): Promise<void> {
        await safeClick(locator, options);
    }

    /**
     * Scroll to element if not in viewport.
     */
    protected async scrollTo(locator: Locator): Promise<void> {
        await scrollToElement(locator);
    }
}
