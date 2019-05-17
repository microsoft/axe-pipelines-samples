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

        // This will use the CHROMEDRIVER env var if it exists (eg, for use with Azure Pipelines hosted agents),
        // and fall back to looking for chromedriver.exe on your PATH (eg, for local development)
        const chromeService = new chrome.ServiceBuilder(process.env.CHROMEDRIVER).build();
        chrome.setDefaultService(chromeService);

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
