import { test } from '@playwright/test';
import { LoginPage } from '../src/pages/web/LoginPage';
import { DashboardPage } from '../src/pages/web/DashboardPage';
import userData from '../data/users.json';

test.describe('User Authentication @login', () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        await loginPage.navigate();
    });

    test('Successful Login with Valid Credentials @valid @smoke', async () => {
        await loginPage.login(userData.validUser.email, userData.validUser.password);
        await dashboardPage.verifyLoaded();
    });

    test('Failed Login with Invalid Credentials @invalid @regression', async () => {
        await loginPage.login(userData.invalidUser.email, userData.invalidUser.password);
        await loginPage.verifyErrorVisible();
    });
});
