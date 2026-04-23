import { BaseMobilePage } from './BaseMobilePage';
import { MOBILE_LOGIN_LOCATORS } from './locators/MobileLoginLocators';

/**
 * Mobile Login Page
 * 
 * Page object for the mobile login screen. Extends BaseMobilePage
 * for navigation and common helpers. Uses MobileLoginLocators for
 * centralized selector management.
 */
export class MobileLoginPage extends BaseMobilePage {
    private readonly locators = MOBILE_LOGIN_LOCATORS;

    constructor(driver: WebdriverIO.Browser) {
        super(driver);
    }

    // ── Element Accessors ───────────────────────────────────

    get emailInput() { return this.driver.$(this.locators.emailInput); }
    get passwordInput() { return this.driver.$(this.locators.passwordInput); }
    get loginButton() { return this.driver.$(this.locators.loginButton); }
    get errorMessage() { return this.driver.$(this.locators.errorMessage); }

    // ── Actions ─────────────────────────────────────────────

    async login(username: string, pass: string) {
        console.log(`[MobileLoginPage] login() started for ${username}`);

        try {
            console.log('[MobileLoginPage] Waiting for email input...');
            const email = this.emailInput;
            await (await email).waitForDisplayed({ timeout: 45000 });
            console.log('[MobileLoginPage] Email input visible. Setting value...');
            await this.safeSetValue(email, username);
            console.log('[MobileLoginPage] Email value set.');

            console.log('[MobileLoginPage] Waiting for password input...');
            const password = this.passwordInput;
            await (await password).waitForDisplayed({ timeout: 45000 });
            console.log('[MobileLoginPage] Password input visible. Setting value...');
            await this.safeSetValue(password, pass);
            console.log('[MobileLoginPage] Password value set.');

            console.log('[MobileLoginPage] Tapping login button...');
            await this.safeTap(this.loginButton);
            console.log('[MobileLoginPage] Login button tapped. Waiting for redirection...');

            await this.driver.pause(10000);
        } catch (err) {
            console.error(`[MobileLoginPage] login() failed: ${err instanceof Error ? err.stack : String(err)}`);
            throw err;
        }
    }
}
