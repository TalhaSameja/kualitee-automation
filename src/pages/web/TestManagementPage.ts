import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { TestManagementLocators } from './locators/TestManagementLocators';

/**
 * Test Management Page
 * 
 * Page object for the Test Management module. Extends BasePage
 * and uses TestManagementLocators for selector management.
 */
export class TestManagementPage extends BasePage {
    private readonly locators: TestManagementLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new TestManagementLocators(page);
    }

    async navigateToModule() {
        await this.locators.testManagementLink.dispatchEvent('click');
    }

    async createTestCase(testData: { name: string; summary: string }) {
        await this.locators.newTestCaseBtn.waitFor({ state: 'visible' });
        await this.locators.newTestCaseBtn.click();

        await this.locators.nameInput.waitFor({ state: 'visible', timeout: 10000 });

        await this.safeFill(this.locators.nameInput, testData.name);
        await this.safeFill(this.locators.summaryInput, testData.summary);

        await this.scrollTo(this.locators.saveButton);
        await this.locators.saveButton.click();
    }

    async verifyTestCaseCreated() {
        await expect(
            this.page.getByText('Test Case Created Successfully').first()
        ).toBeVisible({ timeout: 15000 });
    }
}