// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { convertAxeToSarif } from 'axe-sarif-converter';
import * as AxeBuilder from 'axe-webdriverjs';
import * as fs from 'fs';
import * as path from 'path';
import { Builder, By, ThenableWebDriver, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import { promisify } from 'util';

describe('index.html', () => {
    let driver: ThenableWebDriver;

    // Starting a browser instance is time-consuming, so we share one browser instance between
    // all tests in the file (by initializing it in beforeAll rather than beforeEach)
    beforeAll(async () => {
        // The default timeout (5 seconds) is not always enough to start/quit a browser instance
        jest.setTimeout(30000);

        // This is for the benefit of the Azure Pipelines Hosted Windows agents, which come with
        // webdrivers preinstalled but not on the PATH where Selenium looks for them by default.
        // See https://docs.microsoft.com/en-us/azure/devops/pipelines/test/continuous-test-selenium#decide-how-you-will-deploy-and-test-your-app
        if (process.env.ChromeWebDriver) {
            const hostedAgentChromedriverPath = path.join(process.env.ChromeWebDriver, 'chromedriver.exe');
            const chromeService = new chrome.ServiceBuilder(hostedAgentChromedriverPath).build();
            chrome.setDefaultService(chromeService);
        }

        // Selenium supports many browsers, not just Chrome.
        // See https://www.npmjs.com/package/selenium-webdriver for examples.
        driver = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options().headless())
            .build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    beforeEach(async () => {
        // For simplicity, we're pointing our test browser directly to a static html file on disk.
        //
        // In a real project, you would probably use a localhost http server (Express.js, for example)
        // and point selenium-webdriver to a http://localhost link.
        //
        // See https://jestjs.io/docs/en/testing-frameworks for examples.
        const pageUnderTest = 'file://' + path.join(__dirname, '..', 'src', 'index.html');
        await driver.get(pageUnderTest);

        // Checking for a known element on the page in beforeEach serves two purposes:
        // * It acts as a sanity check that our browser automation setup basically works
        // * It ensures that the page is loaded before we run our accessibility scans
        await driver.wait(until.elementLocated(By.css('h1')));
    });

    it('only contains known accessibility violations', async () => {
        // Run an accessibility scan using axe-webdriverjs
        const axeResults = await AxeBuilder(driver).analyze();

        // Write a test expectation that accounts for "known" issues we want to baseline
        expect(axeResults.violations.length).toBe(5);

        // Write the axe results to a .sarif file, so we can use the SARIF Multitool to
        // apply a baseline file and show the results in the Scans tab in Azure Pipelines
        const sarifResults = convertAxeToSarif(axeResults);
        const testResultsDirectory = path.join(__dirname, '..', 'test-results');
        await promisify(fs.mkdir)(testResultsDirectory, { recursive: true });
        await promisify(fs.writeFile)(
            path.join(testResultsDirectory, 'index.html.axe-core.sarif'),
            // We'll be checking in the resulting .sarif file for baselining purposes, so
            // it's a good idea to use a spacing argument (here, "2") to pretty-print the
            // JSON. This makes it much more pleasant to diff when it changes. 
            JSON.stringify(sarifResults, null, 2));
    });
});
