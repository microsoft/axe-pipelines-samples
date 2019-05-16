// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { Builder, By, until, ThenableWebDriver } from 'selenium-webdriver';
import * as path from 'path';
import * as fs from 'fs';
import * as AxeBuilder from 'axe-webdriverjs';
import { exec } from 'child_process';

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

    it('passes accessibility checks', async () => {
        const header = await driver.wait(until.elementLocated(By.css('h1')));
        await driver.wait(until.elementIsVisible(header));

        const axeResults = await AxeBuilder(driver)
            .options({
                runOnly: {
                    type: "tag",
                    values: ["wcag2a", "wcag2aa"]
                }
            })
            .analyze();

        /*
        const sarifResults = convertAxeToSarif(axeResults);
        await fs.promises.writeFile('./test-results/index.html.sarif', JSON.stringify(sarifResults))
        await exec('./dotnet_tools/sarif match-results-object ./tests/index.test.ts.baseline ./test-results/index.html.sarif');
        */

        expect(axeResults).toMatchInlineSnapshot();
    });

    function getViolationFingerprints(axeResults) {
        return axeResults.violations.map(v => { return {
            id: v.id,
            targets: v.nodes.map(n => n.target),
        }});
    }
});
