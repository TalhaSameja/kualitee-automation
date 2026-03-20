export const appiumConfig = {
    hostname: 'localhost',
    port: 4723,
    path: '/',
    logLevel: 'info',
    capabilities: {
        platformName: 'Android',
        browserName: 'Chrome',
        'appium:automationName': 'UiAutomator2',
        'appium:newCommandTimeout': 3600,
        'appium:nativeWebScreenshot': true,
        'goog:chromeOptions': {
            args: ['--no-first-run', '--disable-fre', '--disable-notifications']
        }
    }
};
