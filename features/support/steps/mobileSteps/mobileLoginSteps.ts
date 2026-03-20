import { Given, When, Then } from '@cucumber/cucumber';
import { MobileLoginPage } from '../../../../src/pages/mobile/MobileLoginPage';
import { driver } from '../../hooks';
import fs from 'fs';
import path from 'path';

const loginPage = new MobileLoginPage();

Given('I am on the mobile login page', async function () {
    await loginPage.navigate();
});

When('I login on mobile with valid credentials', async function () {
    const users = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'users.json'), 'utf8'));
    const email = users.validUser.email;
    const password = users.validUser.password;
    await loginPage.login(email, password);
});

Then('I should be redirected to the mobile dashboard page', async function () {
    // In WDIO, we can check url
    const url = await driver.getUrl();
    // Using simple regex or includes
    if (!url.includes('dashboard')) {
        throw new Error(`Expected URL to contain 'dashboard' but was ${url}`);
    }
});
