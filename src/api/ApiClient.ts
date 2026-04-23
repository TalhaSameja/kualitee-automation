import { APIRequestContext, request } from '@playwright/test';
import { ENV } from '../config/environments';

/**
 * API Client
 * 
 * Centralized HTTP client for API testing.
 * Uses environments.ts for base URL instead of reading process.env directly.
 * Supports all standard HTTP methods for future-proofing.
 */
export class ApiClient {
    private requestContext!: APIRequestContext;
    private baseUrl: string;

    constructor() {
        this.baseUrl = ENV.apiBaseUrl;
    }

    async init() {
        this.requestContext = await request.newContext({
            baseURL: this.baseUrl,
            ignoreHTTPSErrors: true,
            extraHTTPHeaders: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            }
        });
    }

    // ── HTTP Methods ────────────────────────────────────────

    async get(endpoint: string, options?: any) {
        return this.requestContext.get(endpoint, options);
    }

    async post(endpoint: string, options?: any) {
        return this.requestContext.post(endpoint, options);
    }

    async put(endpoint: string, options?: any) {
        return this.requestContext.put(endpoint, options);
    }

    async patch(endpoint: string, options?: any) {
        return this.requestContext.patch(endpoint, options);
    }

    async delete(endpoint: string, options?: any) {
        return this.requestContext.delete(endpoint, options);
    }

    // ── Auth ────────────────────────────────────────────────

    async setAuthToken(token: string) {
        // Recreate the context with the authorization header
        this.requestContext = await request.newContext({
            baseURL: this.baseUrl,
            ignoreHTTPSErrors: true,
            extraHTTPHeaders: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
            }
        });
    }

    // ── Cleanup ─────────────────────────────────────────────

    async close() {
        if (this.requestContext) {
            await this.requestContext.dispose();
        }
    }
}
