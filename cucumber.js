module.exports = {
  default: {
    // 1. Where to find feature files (Web by default)
    paths: ['features/web/**/*.feature'],

    // 2. Load support files (steps & hooks)
    require: ['features/support/**/*.ts'],

    // 3. Load the TypeScript loader (so we can run .ts files)
    requireModule: ['ts-node/register'],

    // 4. Formats: 
    format: [
      'progress-bar',
      'allure-cucumberjs/reporter'
    ],

    // 5. Configuration for Allure
    formatOptions: {
      resultsDir: 'allure-results',
    }
  },
  mobile: {
    paths: ['features/mobile/**/*.feature'],
    require: ['features/support/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress-bar', 'allure-cucumberjs/reporter'],
    formatOptions: { resultsDir: 'allure-results' }
  },
  api: {
    paths: ['features/api/**/*.feature'],
    require: ['features/support/**/*.ts'],
    requireModule: ['ts-node/register'],
    format: ['progress-bar', 'allure-cucumberjs/reporter'],
    formatOptions: { resultsDir: 'allure-results' }
  }
};