// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Builder, By, until, ThenableWebDriver } from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as path from 'path';

describe('index.html', () => {
    const indexUri = 'file://' + path.join(__dirname, '..', 'src', 'index.html');
    let driver: ThenableWebDriver;

    beforeAll(async () => {
        jest.setTimeout(30000);

        // This is for the benefit of the Azure Pipelines Hosted Windows agents, which come with
        // webdrivers preinstalled but not on the PATH where Selenium looks for them by default.
        // See https://docs.microsoft.com/en-us/azure/devops/pipelines/test/continuous-test-selenium#decide-how-you-will-deploy-and-test-your-app
        if (process.env.CHROMEDRIVER) {
            const hostedAgentChromedriverPath = path.join(process.env.CHROMEDRIVER, 'chromedriver.exe');
            const chromeService = new chrome.ServiceBuilder(hostedAgentChromedriverPath).build();
            chrome.setDefaultService(chromeService);
        }

        driver = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(new chrome.Options().headless())
            .build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    beforeEach(async () => {
        await driver.get(indexUri);
    });

    it('renders the expected header text', async () => {
        const header = await driver.wait(until.elementLocated(By.css('h1')));
        await driver.wait(until.elementIsVisible(header));
        const headerText = await header.getText();
        expect(headerText).toEqual('This is a static sample page with some accessibility issues');
    });
});
