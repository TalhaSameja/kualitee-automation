/**
 * Mobile Login Page Locators
 * 
 * Centralized selector definitions for the Mobile Login page.
 * When the app UI changes, update selectors here only.
 * 
 * For native APK testing, replace CSS selectors with:
 *   - Accessibility IDs: '~login_button'
 *   - Resource IDs: 'id=com.example.app:id/email_input'
 *   - XPath: '//android.widget.EditText[@resource-id="email"]'
 */
export const MOBILE_LOGIN_LOCATORS = {
    emailInput: '#email_id',
    passwordInput: '#password',
    loginButton: 'input.submit-btn[value="Log in"]',
    errorMessage: '.toast-message',
};
