/**
 * Common Utilities
 * 
 * Platform-agnostic helper functions shared across
 * web, mobile, and API test layers.
 */

/**
 * Retry an async function up to maxAttempts times.
 * Useful for flaky element interactions or API calls.
 * 
 * @param fn - The async function to retry
 * @param maxAttempts - Maximum number of attempts (default: 3)
 * @param delayMs - Delay between retries in milliseconds (default: 1000)
 * @returns The result of the function if successful
 * @throws The last error if all attempts fail
 */
export async function retry<T>(
    fn: () => Promise<T>,
    maxAttempts: number = 3,
    delayMs: number = 1000
): Promise<T> {
    let lastError: Error | unknown;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error;
            console.warn(
                `[Retry] Attempt ${attempt}/${maxAttempts} failed: ${error instanceof Error ? error.message : String(error)}`
            );
            if (attempt < maxAttempts) {
                await delay(delayMs);
            }
        }
    }

    throw lastError;
}

/**
 * Promisified delay/sleep.
 * 
 * @param ms - Duration in milliseconds
 */
export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Generate a random alphanumeric string.
 * Useful for creating unique test data.
 * 
 * @param length - Desired string length (default: 8)
 * @returns Random string
 */
export function generateRandomString(length: number = 8): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

/**
 * Generate a timestamp string in ISO format.
 * Useful for unique test data names and log entries.
 * 
 * @returns Formatted timestamp string (e.g., "2026-04-22T17:30:00")
 */
export function formatTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

/**
 * Safely parse JSON with error handling.
 * Returns null instead of throwing on invalid JSON.
 * 
 * @param text - The JSON string to parse
 * @returns Parsed object or null
 */
export function safeJsonParse<T = any>(text: string): T | null {
    try {
        return JSON.parse(text) as T;
    } catch {
        console.error('[safeJsonParse] Failed to parse JSON');
        return null;
    }
}
