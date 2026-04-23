import { Page, Locator } from '@playwright/test';

/**
 * Test Management Page Locators
 * 
 * Centralized selector definitions for the Test Management page.
 */
export class TestManagementLocators {
    readonly testManagementLink: Locator;
    readonly newTestCaseBtn: Locator;
    readonly nameInput: Locator;
    readonly summaryInput: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        this.testManagementLink = page.locator('#sidebar-test-management');
        this.newTestCaseBtn = page.getByRole('link', { name: '+New Test Case' });
        this.nameInput = page.getByRole('textbox', { name: 'Test Case Name *' });
        this.summaryInput = page.getByRole('textbox', { name: /Summary/i });
        this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    }
}
