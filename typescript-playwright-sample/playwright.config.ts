import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
    // JUnit output is required to show results in Azure Pipelines' test view
    reporter: [['list'], ['junit', { outputFile: 'test-results/junit.xml' }]],
    retries: 3,
};
export default config;