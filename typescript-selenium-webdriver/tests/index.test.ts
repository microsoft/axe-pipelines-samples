// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { convertAxeToSarif } from 'axe-sarif-converter';
import * as AxeBuilder from 'axe-webdriverjs';
import * as fs from 'fs';
import * as path from 'path';
import { Builder, By, ThenableWebDriver, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import { promisify } from 'util';
import * as Axe from 'axe-core';

const TEST_TIMEOUT_MS = 30000;

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
    }, TEST_TIMEOUT_MS);

    afterAll(async () => {
        await driver.quit();
    }, TEST_TIMEOUT_MS);

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
    }, TEST_TIMEOUT_MS);

    // This test case shows the most basic example: run a scan, fail the test if there are any failures.
    // This is the way to go if you have no known/pre-existing violations you need to temporarily baseline.
    it('has no accessibility violations in the h1 element', async () => {
        const accessibilityScanResults = await AxeBuilder(driver)
            .include('h1')
            .analyze();

        await exportAxeAsSarifTestResult('index-h1-element.sarif', accessibilityScanResults);

        expect(accessibilityScanResults.violations).toStrictEqual([]);
    }, TEST_TIMEOUT_MS);

    // If you want to run a scan of a page but need to exclude an element with known issues (eg, a third-party
    // component you don't control fixing yourself), you can exclude it specifically and still scan the rest
    // of the page.
    it('has no accessibility violations outside of the known example violations', async () => {
        const accessibilityScanResults = await AxeBuilder(driver)
            .exclude('#example-accessibility-violations')
            .analyze();

        await exportAxeAsSarifTestResult('index-except-examples.sarif', accessibilityScanResults);

        expect(accessibilityScanResults.violations).toStrictEqual([]);
    }, TEST_TIMEOUT_MS);

    // If you want to more precisely baseline a particular set of known issues, one option is to use Jest
    // Snapshot Testing (https://jestjs.io/docs/snapshot-testing) with the scan results object.
    it('has only those accessibility violations present in snapshot', async () => {
        const accessibilityScanResults = await AxeBuilder(driver).analyze();

        await exportAxeAsSarifTestResult('index-page.sarif', accessibilityScanResults);

        // Snapshotting the entire violations array like this will show the full available information in
        // your test output for any new violations that might occur.
        expect(accessibilityScanResults.violations).toMatchSnapshot();

        // However, since the "full available information" includes contextual information like "a snippet
        // of the HTML containing the violation" and "the full xpath to the element containing the violation",
        // snapshotting the whole violations array is prone to failing when unrelated changes are made to the
        // element (or even to unrelated ancestors of the element in the DOM).

        // To avoid that, you can create a helper function to capture a "fingerprint" of a given violation,
        // and snapshot that instead. The Jest Snapshot log output will only include the information from your
        // fingerprint, but you can still use the exported .sarif files to see complete failure information
        // in a SARIF viewer (https://sarifweb.azurewebsites.net/#Viewers) or a text editor.
        const getViolationFingerprint = (violation: Axe.Result) => {
            rule: violation.id;
            targets: violation.nodes.map(node => node.target);
        };
        expect(accessibilityScanResults.violations.map(getViolationFingerprint)).toMatchSnapshot();
    }, TEST_TIMEOUT_MS);

    // SARIF is a general-purpose log format for code analysis tools.
    //
    // Exporting axe results as .sarif files lets our Azure Pipelines build results page show a nice visualization
    // of any accessibility failures we find using the Sarif Results Viewer Tab extension
    // (https://marketplace.visualstudio.com/items?itemName=sariftools.sarif-viewer-build-tab)
    async function exportAxeAsSarifTestResult(sarifFileName: string, axeResults: Axe.AxeResults): Promise<void> {
        // We use the axe-sarif-converter package for the conversion step, then write the results
        // to a file that we'll be publishing from a CI build step in azure-pipelines.yml
        const sarifResults = convertAxeToSarif(axeResults);

        // This directory should be .gitignore'd and should be published as a build artifact in azure-pipelines.yml
        const testResultsDirectory = path.join(__dirname, '..', 'test-results');
        await promisify(fs.mkdir)(testResultsDirectory, { recursive: true });

        const sarifResultFile = path.join(testResultsDirectory, sarifFileName);
        await promisify(fs.writeFile)(
            sarifResultFile,
            JSON.stringify(sarifResults, null, 2));

        console.log(`Exported axe results to ${sarifResultFile}`);
    }
});
