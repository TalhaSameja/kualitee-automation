import fs from 'fs';
import path from 'path';

/**
 * Test Data Manager
 * 
 * Single, centralized interface for reading test data files.
 * Replaces the inconsistent mix of `import ... from` and
 * `fs.readFileSync(path.join(...))` used across step definitions.
 * 
 * Usage:
 *   import { TestDataManager } from '../../src/common/TestDataManager';
 *   const users = TestDataManager.getUsers();
 *   const email = users.validUser.email;
 */

// ── Type Definitions ────────────────────────────────────────

export interface UserCredentials {
    email: string;
    username: string;
    password: string;
}

export interface UsersData {
    validUser: UserCredentials;
    invalidUser: UserCredentials;
    [key: string]: UserCredentials;  // Allow additional user profiles
}

export interface TestCaseData {
    name: string;
    summary: string;
}

export interface TestCasesData {
    [key: string]: TestCaseData;
}

// ── Data Directory ──────────────────────────────────────────

const DATA_DIR = path.join(process.cwd(), 'data');

// ── Manager Class ───────────────────────────────────────────

export class TestDataManager {
    private static cache: Map<string, any> = new Map();

    /**
     * Read and parse a JSON file from the data directory.
     * Results are cached to avoid repeated file reads.
     */
    private static readDataFile<T>(filename: string): T {
        if (this.cache.has(filename)) {
            return this.cache.get(filename) as T;
        }

        const filePath = path.join(DATA_DIR, filename);

        if (!fs.existsSync(filePath)) {
            throw new Error(`[TestDataManager] Data file not found: ${filePath}`);
        }

        const data = JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
        this.cache.set(filename, data);
        return data;
    }

    /**
     * Get user credentials data.
     * Source: data/users.json, overridden by TEST_USER / TEST_PASSWORD env vars.
     */
    static getUsers(): UsersData {
        const users = this.readDataFile<UsersData>('users.json');
        
        // Override with environment variables for CI
        if (process.env.TEST_USER) {
            users.validUser.email = process.env.TEST_USER;
            users.validUser.username = process.env.TEST_USER;
        }
        if (process.env.TEST_PASSWORD) {
            users.validUser.password = process.env.TEST_PASSWORD;
        }
        
        return users;
    }

    /**
     * Get test case data.
     * Source: data/testCases.json
     */
    static getTestCases(): TestCasesData {
        return this.readDataFile<TestCasesData>('testCases.json');
    }

    /**
     * Get any custom data file by name.
     * Source: data/<filename>
     */
    static getCustomData<T>(filename: string): T {
        return this.readDataFile<T>(filename);
    }

    /**
     * Clear the cache (useful between test suites or environments).
     */
    static clearCache(): void {
        this.cache.clear();
    }
}
