// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { convertAxeToSarif } from 'axe-sarif-converter';
import * as AxeBuilder from 'axe-webdriverjs';
import * as fs from 'fs';
import * as path from 'path';
import { Builder, By, ThenableWebDriver, until } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import { promisify } from 'util';
import { exec, execFile } from 'child_process';
import * as jsonpath from 'jsonpath';
import * as Axe from 'axe-core';

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

    // This test case shows how to baseline known failures using the SARIF SDK.
    //
    // It baselines the same set of failures as the Jest Snapshot examples, but uses SARIF result
    // fingerprinting to correlate results from the baseline file to results from a fresh scan. This
    // offers the resiliency to unrelated changes of the snapshot fingerprinting approach with the
    // full test log output of the full-result-snapshotting approach, and also enables the baseline
    // visualization functionality of the SARIF Results Explorer Tab extension in Azure Pipelines.
    //
    // Today, this requires boilerplate helper functions here and some boilerplate scripts entries
    // in your package.json to ensure the .NET Core SDK and SARIF Multitool NuGet package are installed.
    it('has only those accessibility violations present in SARIF baseline file', async () => {
        const accessibilityScanResults = await AxeBuilder(driver).analyze();

        const sarifResultsFile = path.join(testResultsDirectory, 'index.html.sarif');
        await exportAsSarifFile(sarifResultsFile, accessibilityScanResults);

        // The baseline file should be checked in to source control next to your tests.
        const sarifBaselineFile = path.join(__dirname, 'index.html_baseline.sarif');
        await verifyAgainstSarifBaselineFile(sarifResultsFile, sarifBaselineFile);
    });

    const testResultsDirectory = path.join(__dirname, '..', 'test-results');

    async function exportAsSarifFile(sarifFilePath: string, axeResults: Axe.AxeResults): Promise<void> {
        await ensureDirectoryExists(path.dirname(sarifFilePath));

        const sarifResults = convertAxeToSarif(axeResults);

        await promisify(fs.writeFile)(
            sarifFilePath,
            JSON.stringify(sarifResults, null, 2));
    }

    async function verifyAgainstSarifBaselineFile(sarifResultsFile: string, sarifBaselineFile: string): Promise<void> {
        await mergeSarifFileWithBaseline(sarifResultsFile, sarifBaselineFile);

        const errorsChangedSinceBaseline = await querySarifFileForErrorsChangedSinceBaseline(sarifResultsFile);

        try {
            expect(errorsChangedSinceBaseline).toStrictEqual([]);
        } catch(e) {
            console.error(
                'Accessibility errors have changed since the baseline file was created. To update the baseline, run:\n' +
                    `\tcopy ${sarifResultsFile} ${sarifBaselineFile}\n`);

            throw e;
        }
    }

    async function ensureDirectoryExists(directory: string): Promise<void> {
        await promisify(fs.mkdir)(directory, { recursive: true });
    }

    async function mergeSarifFileWithBaseline(newSarifFile: string, baselineSarifFile: string): Promise<void> {
        await promisify(execFile)(
            path.join(__dirname, '..', 'dotnet_tools', 'sarif'),
            ['transform', '--inline', '--pretty-print', newSarifFile]);

        const baselineExists = await promisify(fs.exists)(baselineSarifFile);
        if (!baselineExists) {
            await promisify(fs.copyFile)(newSarifFile, baselineSarifFile);
            console.warn(`Created new baseline file (which you should check into source control) at ${baselineSarifFile}`);
        }

        await promisify(execFile)(
            path.join(__dirname, '..', 'dotnet_tools', 'sarif'),
            ['match-results-forward', '--previous', baselineSarifFile, '--output-file-path', newSarifFile, '--pretty-print', newSarifFile]);
    }

    async function querySarifFileForErrorsChangedSinceBaseline(sarifFilePath: string): Promise<any[]> {
        const rawSarifFileContents = await promisify(fs.readFile)(sarifFilePath);
        const sarifContents = JSON.parse(rawSarifFileContents.toString());

        return jsonpath.query(sarifContents, '$.runs[*].results[?(@.baselineState!="unchanged" && (@.kind=="error" || !@.kind))]');
    }
});
