import { Given, When, Then } from '@cucumber/cucumber';
import { page } from '../../support/hooks';
import { LoginPage } from '../../pages/web/LoginPage';
import { DashboardPage } from '../../pages/web/DashboardPage';
import { TestDataManager } from '../../common/TestDataManager';

let loginPage: LoginPage;
let dashboardPage: DashboardPage;

Given('I am on the login page', async () => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.navigate();
});

When('I login with valid credentials', async () => {
    const users = TestDataManager.getUsers();
    await loginPage.login(users.validUser.email, users.validUser.password);
});

When('I login with invalid credentials', async () => {
    const users = TestDataManager.getUsers();
    await loginPage.login(users.invalidUser.email, users.invalidUser.password);
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
    const users = TestDataManager.getUsers();
    await loginPage.navigate();
    await loginPage.login(users.validUser.email, users.validUser.password);

    // 3. Verify we made it to the dashboard
    await dashboardPage.verifyLoaded();
});
