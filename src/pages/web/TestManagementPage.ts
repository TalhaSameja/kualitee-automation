import { Page, Locator, expect } from '@playwright/test';

export class TestManagementPage {
    readonly page: Page;
    
    // Locators
    readonly testManagementLink: Locator;
    readonly newTestCaseBtn: Locator;
    readonly nameInput: Locator;
    readonly summaryInput: Locator;
    readonly saveButton: Locator;

    constructor(page: Page) {
        this.page = page;

        this.testManagementLink = page.locator('#sidebar-test-management');

        this.newTestCaseBtn = page.getByRole('link', { name: '+New Test Case' });

        this.nameInput = page.getByRole('textbox', { name: 'Test Case Name *' });

        this.summaryInput = page.getByRole('textbox', { name: /Summary/i });

        this.saveButton = page.getByRole('button', { name: 'Save', exact: true });
    }

    async navigateToModule() {
     
        await this.testManagementLink.dispatchEvent('click');
    }

    async createTestCase(testData: { name: string, summary: string }) {
        await this.newTestCaseBtn.waitFor({ state: 'visible' });
        await this.newTestCaseBtn.click();
        
        await this.nameInput.waitFor({ state: 'visible', timeout: 10000 });
        
        await this.nameInput.fill(testData.name);
        await this.summaryInput.fill(testData.summary);
        
        await this.saveButton.scrollIntoViewIfNeeded();
        await this.saveButton.click();
    }

    async verifyTestCaseCreated() {
        await expect(this.page.getByText('Test Case Created Successfully').first()).toBeVisible({ timeout: 15000 });
    }
}