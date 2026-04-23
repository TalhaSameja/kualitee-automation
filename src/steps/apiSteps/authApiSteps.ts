import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ApiClient } from '../../api/ApiClient';
import { API_ENDPOINTS } from '../../config/endpoints';
import { TestDataManager } from '../../common/TestDataManager';
import { logResponse, validateStatusCode, validateResponseHasProperty } from '../../api/common/ApiHelpers';

let apiClient: ApiClient;
let response: any;
let responseData: any;

Given('I want to authenticate via the API', async function () {
    apiClient = new ApiClient();
    await apiClient.init();
});

When('I send a valid payload to the login endpoint', async function () {
    const users = TestDataManager.getUsers();
    const payload = {
        username: users.validUser.username,
        password: users.validUser.password
    };

    response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        data: payload
    });

    responseData = await response.json();
    logResponse('Login', response, responseData);
});

When('I send a payload with email {string} and password {string}', async function (email: string, password: string) {
    const payload = {
        username: email,
        password: password
    };

    response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        data: payload
    });

    responseData = await response.json();
    logResponse('Login (Invalid)', response, responseData);
});

Then('the API should respond with status code {int}', async function (statusCode: number) {
    validateStatusCode(response, statusCode);
});

Then('the response should contain a token', async function () {
    validateResponseHasProperty(responseData, 'accessToken');
});

Then('the response should contain an error message', async function () {
    validateResponseHasProperty(responseData, 'message');
});
