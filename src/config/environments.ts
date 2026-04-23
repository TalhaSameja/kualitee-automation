import 'dotenv/config';

/**
 * Centralized Environment Configuration
 * 
 * Single source of truth for all URLs and environment settings.
 * All page objects, API clients, and hooks import from here
 * instead of reading process.env directly.
 */

export type EnvironmentName = 'dev' | 'staging' | 'uat' | 'prod';

interface EnvironmentConfig {
    baseUrl: string;
    apiBaseUrl: string;
    mobileBaseUrl: string;
}

/**
 * Predefined environment configurations.
 * Add new environments here as needed.
 */
const ENVIRONMENTS: Record<EnvironmentName, EnvironmentConfig> = {
    dev: {
        baseUrl: 'https://kualitee-oi-dev.kualiteestaging.com/',
        apiBaseUrl: 'https://kualitee-oi-dev.kualiteestaging.com/api/v2/',
        mobileBaseUrl: 'https://kualitee-oi-dev.kualiteestaging.com/',
    },
    staging: {
        baseUrl: 'https://kualitee-oi-staging.kualiteestaging.com/',
        apiBaseUrl: 'https://kualitee-oi-staging.kualiteestaging.com/api/v2/',
        mobileBaseUrl: 'https://kualitee-oi-staging.kualiteestaging.com/',
    },
    uat: {
        baseUrl: 'https://kualitee-oi-uat.kualiteestaging.com/',
        apiBaseUrl: 'https://kualitee-oi-uat.kualiteestaging.com/api/v2/',
        mobileBaseUrl: 'https://kualitee-oi-uat.kualiteestaging.com/',
    },
    prod: {
        baseUrl: 'https://app.kualitee.com/',
        apiBaseUrl: 'https://app.kualitee.com/api/v2/',
        mobileBaseUrl: 'https://app.kualitee.com/',
    },
};

/**
 * Resolve the current environment name from ENV_NAME variable.
 * Falls back to 'uat' if not specified.
 */
function getCurrentEnvName(): EnvironmentName {
    const envName = (process.env.ENV_NAME || 'uat').toLowerCase();
    if (envName in ENVIRONMENTS) {
        return envName as EnvironmentName;
    }
    console.warn(`Unknown ENV_NAME "${envName}", falling back to "uat"`);
    return 'uat';
}

/**
 * The active environment configuration.
 * 
 * Priority: .env overrides > predefined environment map > defaults
 * 
 * Usage:
 *   import { ENV } from '../../src/config/environments';
 *   await page.goto(ENV.baseUrl);
 */
export const ENV = {
    /** Current environment name (dev | staging | uat | prod) */
    name: getCurrentEnvName(),

    /** Web application base URL */
    get baseUrl(): string {
        return process.env.BASE_URL || ENVIRONMENTS[this.name].baseUrl;
    },

    /** API base URL */
    get apiBaseUrl(): string {
        return process.env.API_BASE_URL || ENVIRONMENTS[this.name].apiBaseUrl;
    },

    /** Mobile web/app base URL */
    get mobileBaseUrl(): string {
        return process.env.MOBILE_BASE_URL || ENVIRONMENTS[this.name].mobileBaseUrl;
    },

    /** Path to APK file for native app testing */
    get apkPath(): string {
        return process.env.APK_PATH || '';
    },

    /** Device name for Appium */
    get deviceName(): string {
        return process.env.DEVICE_NAME || '';
    },

    /** Whether running in CI */
    get isCI(): boolean {
        return process.env.CI === 'true';
    },
};
