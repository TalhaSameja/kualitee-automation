import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly dashboardText: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardText = page.locator('h1, h2, .main-header').or(page.getByText('Dashboard', { exact: false })).first();
    }

    async verifyLoaded() {
        await expect(this.page).toHaveURL(/.*dashboard/, { timeout: 15000 });

        await expect(this.dashboardText).toBeVisible({ timeout: 10000 });
    }
}