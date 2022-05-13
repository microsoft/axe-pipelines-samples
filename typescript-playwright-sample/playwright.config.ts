import { PlaywrightTestConfig } from '@playwright/test';
const config: PlaywrightTestConfig = {
    // You can use multiple projects to test against a variety of different
    // browsers, devices, etc
    //
    // In this sample, we use one project to select just our passing example
    // tests (to demonstrate what a passing CI build would look like) and a
    // second project to run all of our example tests, including some that
    // fail (to demonstrate what a failing CI build would look like)
    projects: [
        {
            name: 'passing-example',
            testMatch: '**/passing-examples.spec.ts',
            retries: 3,
        },
        {
            name: 'failing-example',
            testMatch: '**/failing-examples.spec.ts'
        }
    ],

    // JUnit output is required to show results in Azure Pipelines' test view
    reporter: [['list'], ['junit', { outputFile: 'test-results/junit.xml' }]],
};
export default config;