import { driver } from '../../../features/support/hooks';
import type { ChainablePromiseElement } from 'webdriverio';

export class MobileLoginPage {
    // In WebdriverIO, elements are fetched asynchronously
    // Refined locators using formcontrolname for reliability in Angular
    get emailInput() { return driver.$('#email_id'); }
    get passwordInput() { return driver.$('#password'); }
    get loginButton() { return driver.$('input.submit-btn[value="Log in"]'); }
    get errorMessage() { return driver.$('.toast-message'); }

    async navigate() {
        const url = process.env.BASE_URL || 'https://kualitee-oi-uat.kualiteestaging.com/';
        console.log(`Navigating to: ${url}`);
        await driver.url(url);
        console.log('Navigation call sent. Waiting for load...');
        await driver.pause(10000); 
    }

    /**
     * Set value with a fallback to executeScript for mobile browsers
     */
    private async setValueMobile(elementPromise: any, value: string) {
        const element = await elementPromise;
        try {
            await element.click();
            await element.setValue(value);
            
            // Verify if value was actually set (sometimes mobile browsers fail silently)
            const currentValue = await element.getValue();
            if (currentValue !== value) {
                throw new Error(`Standard setValue failed to set correct value. Got: ${currentValue}`);
            }
        } catch (error) {
            console.log(`Standard input failed, using execute fallback: ${error instanceof Error ? error.message : String(error)}`);
            await driver.execute(
                'arguments[0].value = arguments[1]; arguments[0].dispatchEvent(new Event("input", { bubbles: true })); arguments[0].dispatchEvent(new Event("change", { bubbles: true })); arguments[0].dispatchEvent(new Event("blur", { bubbles: true }));',
                element,
                value
            );
        }
    }

    async login(username: string, pass: string) {
        console.log(`DEBUG: login() started for ${username}`);
        
        try {
            console.log('DEBUG: Waiting for email input...');
            const email = this.emailInput;
            await email.waitForDisplayed({ timeout: 45000 });
            console.log('DEBUG: Email input visible. Setting value...');
            await this.setValueMobile(email, username);
            console.log('DEBUG: Email value set.');

            console.log('DEBUG: Waiting for password input...');
            const password = this.passwordInput;
            await password.waitForDisplayed({ timeout: 45000 });
            console.log('DEBUG: Password input visible. Setting value...');
            await this.setValueMobile(password, pass);
            console.log('DEBUG: Password value set.');

            console.log('DEBUG: Clicking login button...');
            const btn = this.loginButton;
            await btn.waitForClickable({ timeout: 45000 });
            
            try {
                await btn.click();
                console.log('DEBUG: Standard click completed.');
            } catch (error) {
                console.log(`DEBUG: Standard click failed, using execute fallback: ${error instanceof Error ? error.message : String(error)}`);
                await driver.execute('arguments[0].click();', btn);
                console.log('DEBUG: Execute click completed.');
            }
            
            console.log('DEBUG: Login button click action completed. Waiting for redirection...');
            await driver.pause(10000); 
        } catch (err) {
            console.error(`DEBUG: login() failed with error: ${err instanceof Error ? err.stack : String(err)}`);
            throw err;
        }
    }
}
