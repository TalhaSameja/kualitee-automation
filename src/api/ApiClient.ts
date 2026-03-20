import { APIRequestContext, request } from '@playwright/test';

export class ApiClient {
    private requestContext!: APIRequestContext;
    private baseUrl: string;

    constructor() {
        this.baseUrl = process.env.API_BASE_URL || 'https://kualitee-oi-uat.kualiteestaging.com/api/v2/';
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

    // Helper wrappers to attach default behaviors
    async get(endpoint: string, options?: any) {
        return this.requestContext.get(endpoint, options);
    }

    async post(endpoint: string, options?: any) {
        return this.requestContext.post(endpoint, options);
    }

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

    async close() {
        if (this.requestContext) {
            await this.requestContext.dispose();
        }
    }
}
