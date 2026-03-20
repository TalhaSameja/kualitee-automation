import { When, Then } from '@cucumber/cucumber';
import { page } from '../../hooks';
import { TestManagementPage } from '../../../../src/pages/web/TestManagementPage';
import testCaseData from '../../../../data/testCases.json';

let tmPage: TestManagementPage;

When('I navigate to the Test Management module', async () => {
    tmPage = new TestManagementPage(page);
    await tmPage.navigateToModule();
});

When('I create a {string} test case', async (dataKey: string) => {

    const specificData = testCaseData[dataKey];

    if (!specificData) {
        throw new Error(`Test data for key '${dataKey}' not found in testCases.json`);
    }

    await tmPage.createTestCase(specificData);
});

Then('the test case should be created successfully', async () => {
    await tmPage.verifyTestCaseCreated();
});