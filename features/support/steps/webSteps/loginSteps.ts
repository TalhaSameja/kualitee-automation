import { Given, When, Then } from '@cucumber/cucumber';
import { page } from '../../hooks';
import { LoginPage } from '../../../../src/pages/web/LoginPage';
import { DashboardPage } from '../../../../src/pages/web/DashboardPage';
import userData from '../../../../data/users.json';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

Given('I am on the login page', async () => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
});

When('I login with valid credentials', async () => {
    await loginPage.login(userData.validUser.email, userData.validUser.password);
});

When('I login with invalid credentials', async () => {
    await loginPage.login(userData.invalidUser.email, userData.invalidUser.password);
});

Then('I should be redirected to the dashboard page', async () => {
    await dashboardPage.verifyLoaded();
});

Then('I should see an error message', async () => {
    await loginPage.verifyErrorVisible();
});


Given('I am logged in to the application', async () => {
    // 1. Initialize Pages
    loginPage = new LoginPage(page);
    let dashboardPage = new DashboardPage(page);

    // 2. Perform Login Flow
    await loginPage.navigate();
    await loginPage.login(userData.validUser.email, userData.validUser.password);

    // 3. Verify we made it to the dashboard
    await dashboardPage.verifyLoaded();
});