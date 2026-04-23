import { Page, Locator } from '@playwright/test';

/**
 * Login Page Locators
 * 
 * Centralized selector definitions for the Login page.
 * Separated from page logic so selectors can be updated
 * in one place when the UI changes.
 */
export class LoginLocators {
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly errorMessage: Locator;

    constructor(page: Page) {
        this.emailInput = page.locator('#email_id');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('input.submit-btn[type="submit"]');
        this.errorMessage = page.getByText('Email must be a valid email')
            .or(page.locator('.toast-message'))
            .or(page.getByText('Invalid user name or password'));
    }
}
