// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Builder, By, until, ThenableWebDriver } from 'selenium-webdriver';
import * as path from 'path';

describe('index.html', () => {
    const indexUri = 'file://' + path.join(__dirname, '..', 'src', 'index.html');
    let driver: ThenableWebDriver;

    beforeAll(async () => {
        driver = new Builder().forBrowser('firefox').build();
    });

    afterAll(async () => {
        await driver.quit();
    });

    beforeEach(async () => {
        await driver.get(indexUri);
    })

    it('renders the expected header text', async () => {
        const header = await driver.wait(until.elementLocated(By.css('h1')));
        await driver.wait(until.elementIsVisible(header));
        const headerText = await header.getText();
        expect(headerText).toEqual('This is a static sample page with some accessibility issues');
    });
});
