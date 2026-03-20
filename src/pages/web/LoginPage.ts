import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.page = page;
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.passwordInput = page.locator('input[type="password"], input[name="password"]');
        this.loginButton = page.getByRole('button', { name: 'Log in' });
        
        this.errorMessage = page.getByText('Email must be a valid email')
                                .or(page.locator('.toast-message'))
                                .or(page.getByText('Invalid user name or password'));
    }

    async navigate() {
        await this.page.goto(process.env.BASE_URL || 'https://kualitee-oi-uat.kualiteestaging.com/');
    }

    async login(username: string, pass: string) {
        await this.emailInput.waitFor({ state: 'visible' });
        await this.emailInput.fill(username);
        await this.passwordInput.fill(pass);
        await this.loginButton.click();
    }

    async verifyErrorVisible() {
        await expect(this.errorMessage.first()).toBeVisible({ timeout: 5000 });
    }
}       