/**
 * API Endpoint Registry
 * 
 * Central registry of all API endpoints used across tests.
 * Step definitions and ApiClient reference these constants
 * instead of using inline string literals.
 * 
 * Usage:
 *   import { API_ENDPOINTS } from '../../src/config/endpoints';
 *   await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { data: payload });
 */

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: 'auth/login',
        LOGOUT: 'auth/logout',
        REFRESH: 'auth/refresh',
    },

    USERS: {
        LIST: 'users',
        GET_BY_ID: (id: string | number) => `users/${id}`,
        CREATE: 'users/add',
        UPDATE: (id: string | number) => `users/${id}`,
        DELETE: (id: string | number) => `users/${id}`,
    },

    TEST_CASES: {
        LIST: 'test-cases',
        GET_BY_ID: (id: string | number) => `test-cases/${id}`,
        CREATE: 'test-cases',
        UPDATE: (id: string | number) => `test-cases/${id}`,
        DELETE: (id: string | number) => `test-cases/${id}`,
    },

    PROJECTS: {
        LIST: 'projects',
        GET_BY_ID: (id: string | number) => `projects/${id}`,
    },
} as const;
