import { expect } from '@playwright/test';

/**
 * API Helpers
 * 
 * Common API utility methods shared across all API step definitions.
 * Encapsulates repeated patterns like response logging,
 * status validation, and property assertions.
 */

/**
 * Log an API response in a standardized format.
 * Replaces inline console.log scattered across step files.
 * 
 * @param label - A label for context (e.g., "Login", "Create User")
 * @param response - Playwright APIResponse object
 * @param data - Parsed response body
 */
export function logResponse(label: string, response: any, data: any): void {
    console.log(`[API:${label}] Status: ${response.status()}`);
    console.log(`[API:${label}] Body: ${JSON.stringify(data, null, 2)}`);
}

/**
 * Validate that the response has the expected HTTP status code.
 * 
 * @param response - Playwright APIResponse object
 * @param expectedStatus - Expected HTTP status code
 */
export function validateStatusCode(response: any, expectedStatus: number): void {
    expect(response.status()).toBe(expectedStatus);
}

/**
 * Validate that the response body contains a specific property.
 * 
 * @param data - Parsed response body
 * @param property - Property name to check for
 */
export function validateResponseHasProperty(data: any, property: string): void {
    expect(data).toHaveProperty(property);
}

/**
 * Extract and return auth token from a login response.
 * 
 * @param responseData - Parsed login response body
 * @param tokenField - Name of the token field (default: 'accessToken')
 * @returns The extracted token string
 */
export function extractToken(responseData: any, tokenField: string = 'accessToken'): string {
    const token = responseData[tokenField];
    if (!token) {
        throw new Error(`[ApiHelpers] Token field "${tokenField}" not found in response`);
    }
    console.log(`[ApiHelpers] Token extracted successfully (${token.substring(0, 20)}...)`);
    return token;
}
