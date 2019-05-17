// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Builder, By, until, ThenableWebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as path from 'path';
import * as AxeBuilder from 'axe-webdriverjs';

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
    });

    it('renders the expected header text', async () => {
        const header = await driver.wait(until.elementLocated(By.css('h1')));
        await driver.wait(until.elementIsVisible(header));
        const headerText = await header.getText();
        expect(headerText).toEqual('This is a static sample page with some accessibility issues');
    });

    it('passes accessibility checks', async () => {
        const header = await driver.wait(until.elementLocated(By.css('h1')));
        await driver.wait(until.elementIsVisible(header));

        const axeResults = await AxeBuilder(driver).analyze();

        expect(axeResults.violations.length).toBe(5);
    });
});
