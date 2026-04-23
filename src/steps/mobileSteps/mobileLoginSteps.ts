import { Given, When, Then } from '@cucumber/cucumber';
import { MobileLoginPage } from '../../pages/mobile/MobileLoginPage';
import { driver } from '../../support/hooks';
import { TestDataManager } from '../../common/TestDataManager';

let loginPage: MobileLoginPage;

Given('I am on the mobile login page', async function () {
    loginPage = new MobileLoginPage(driver);
    await loginPage.navigate();
});

When('I login on mobile with valid credentials', async function () {
    const users = TestDataManager.getUsers();
    await loginPage.login(users.validUser.email, users.validUser.password);
});

Then('I should be redirected to the mobile dashboard page', async function () {
    const url = await driver.getUrl();
    if (!url.includes('dashboard')) {
        throw new Error(`Expected URL to contain 'dashboard' but was ${url}`);
    }
});
