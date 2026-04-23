import { Page, Locator } from '@playwright/test';

/**
 * Dashboard Page Locators
 * 
 * Centralized selector definitions for the Dashboard page.
 */
export class DashboardLocators {
    readonly dashboardText: Locator;

    constructor(page: Page) {
        this.dashboardText = page.locator('h1, h2, .main-header')
            .or(page.getByText('Dashboard', { exact: false }))
            .first();
    }
}
