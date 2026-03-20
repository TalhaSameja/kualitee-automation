import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { ApiClient } from '../../../../src/api/ApiClient';
import fs from 'fs';
import path from 'path';

let apiClient: ApiClient;
let response: any;
let responseData: any;

Given('I want to authenticate via the API', async function () {
    apiClient = new ApiClient();
    await apiClient.init();
});

When('I send a valid payload to the login endpoint', async function () {
    const users = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'data', 'users.json'), 'utf8'));
    const payload = {
        username: users.validUser.username,
        password: users.validUser.password
    };

    response = await apiClient.post('auth/login', {
        data: payload
    });

    responseData = await response.json();
    console.log(`DEBUG: API Response Status: ${response.status()}`);
    console.log(`DEBUG: API Response Body: ${JSON.stringify(responseData, null, 2)}`);
});

When('I send a payload with email {string} and password {string}', async function (email: string, password: string) {
    const payload = {
        username: email,
        password: password
    };

    response = await apiClient.post('auth/login', {
        data: payload
    });

    responseData = await response.json();
    console.log(`DEBUG: API Response Status: ${response.status()}`);
    console.log(`DEBUG: API Response Body: ${JSON.stringify(responseData, null, 2)}`);
});

Then('the API should respond with status code {int}', async function (statusCode: number) {
    expect(response.status()).toBe(statusCode);
});

Then('the response should contain a token', async function () {
    expect(responseData).toHaveProperty('accessToken');
});

Then('the response should contain an error message', async function () {
    expect(responseData).toHaveProperty('message'); 
});

