import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { DashboardLocators } from './locators/DashboardLocators';

/**
 * Dashboard Page
 * 
 * Page object for the Dashboard page. Extends BasePage
 * and uses DashboardLocators for selector management.
 */
export class DashboardPage extends BasePage {
    private readonly locators: DashboardLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new DashboardLocators(page);
    }

    async verifyLoaded() {
        await expect(this.page).toHaveURL(/.*dashboard/, { timeout: 15000 });
        await expect(this.locators.dashboardText).toBeVisible({ timeout: 10000 });
    }
}