import { ENV } from '../src/config/environments';

/**
 * Appium Configuration
 * 
 * Uses environments.ts for dynamic URL values.
 * APK path and device name are configurable via .env.
 */
export const appiumConfig = {
    hostname: 'localhost',
    port: 4723,
    path: '/',
    logLevel: 'info',
    capabilities: {
        platformName: 'Android',
        // For mobile web testing (Chrome browser)
        ...(ENV.apkPath
            ? { 'appium:app': ENV.apkPath }   // Native APK testing
            : { browserName: 'Chrome' }         // Mobile web testing
        ),
        ...(ENV.deviceName && { 'appium:deviceName': ENV.deviceName }),
        'wdio:enforceWebDriverClassic': true,
        'appium:automationName': 'UiAutomator2',
        'appium:newCommandTimeout': 3600,
        'appium:nativeWebScreenshot': true,
        'goog:chromeOptions': {
            args: ['--no-first-run', '--disable-fre', '--disable-notifications']
        }
    }
};
