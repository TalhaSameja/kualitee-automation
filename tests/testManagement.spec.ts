import { test } from '@playwright/test';
import { LoginPage } from '../src/pages/web/LoginPage';
import { DashboardPage } from '../src/pages/web/DashboardPage';
import { TestManagementPage } from '../src/pages/web/TestManagementPage';
import userData from '../data/users.json';
import testCaseData from '../data/testCases.json';

test.describe('Test Case Management @testcase', () => {
    let loginPage: LoginPage;
    let dashboardPage: DashboardPage;
    let tmPage: TestManagementPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        dashboardPage = new DashboardPage(page);
        tmPage = new TestManagementPage(page);

        // Background: Given I am logged in to the application
        await loginPage.navigate();
        await loginPage.login(userData.validUser.email, userData.validUser.password);
        await dashboardPage.verifyLoaded();
    });

    test('Create a Smoke Test Case', async () => {
        // When I navigate to the Test Management module
        await tmPage.navigateToModule();

        // And I create a "smokeTest" test case
        const specificData = (testCaseData as any)['smokeTest'];
        if (!specificData) {
            throw new Error(`Test data for key 'smokeTest' not found in testCases.json`);
        }
        await tmPage.createTestCase(specificData);

        // Then the test case should be created successfully
        await tmPage.verifyTestCaseCreated();
    });
});
