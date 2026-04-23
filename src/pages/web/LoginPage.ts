import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { LoginLocators } from './locators/LoginLocators';

/**
 * Login Page
 * 
 * Page object for the Login page. Extends BasePage for
 * navigation and common helpers. Uses LoginLocators for
 * centralized selector management.
 */
export class LoginPage extends BasePage {
    private readonly locators: LoginLocators;

    constructor(page: Page) {
        super(page);
        this.locators = new LoginLocators(page);
    }

    async navigate() {
        await super.navigate();
    }

    async login(username: string, pass: string) {
        await this.locators.emailInput.waitFor({ state: 'visible', timeout: 15000 });

        await this.safeFill(this.locators.emailInput, username);
        await this.safeFill(this.locators.passwordInput, pass);

        await this.locators.loginButton.click();
    }

    async verifyErrorVisible() {
        await expect(this.locators.errorMessage.first()).toBeVisible({ timeout: 5000 });
    }
}