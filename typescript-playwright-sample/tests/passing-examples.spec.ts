// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { test, expect } from '@playwright/test';
import * as Axe from 'axe-core';
import AxeBuilder from '@axe-core/playwright';
import * as path from 'path';
import { exportAxeAsSarifTestResult } from './export-to-sarif';

test.describe('[passing examples] index.html', () => {
    test.beforeEach(async ({page}) => {
        // For simplicity, we're pointing our test browser directly to a static html file on disk.
        //
        // In a project with more complex hosting needs, you might instead start up a localhost http server
        // from your test's beforeAll block, and point your test cases to a http://localhost link.
        //
        // Some common node.js libraries for hosting this sort of localhost http server include Express.js,
        // http-server, and Koa.
        const pageUnderTest = 'file://' + path.join(__dirname, '..', 'src', 'index.html');
        await page.goto(pageUnderTest);

        // Checking for a known element on the page in beforeEach serves two purposes:
        // * It acts as a smoke test that our browser automation setup basically works
        // * It ensures that the page is loaded before we run our accessibility scans
        await page.waitForSelector('h1');
    });


    // This test case shows the most basic example: run a scan, fail the test if there are any failures.
    // This is the way to go if you have no known/pre-existing violations you need to temporarily baseline.
    test('accessibility of h1 element', async ({ browserName, page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
            // You can use any CSS selector in place of "h1" here
            .include('h1')
            // This withTags directive restricts Axe to only run tests that detect known violations of
            // WCAG 2.1 A and AA rules (similar to what Accessibility Insights reports). If you omit
            // this, Axe will additionally run several "best practice" rules, which are good ideas to
            // check for periodically but may report false positives in certain edge cases.
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        await exportAxeAsSarifTestResult('index-h1-element.sarif', accessibilityScanResults, browserName);

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    // If you want to run a scan of a page but need to exclude an element with known issues (eg, a third-party
    // component you don't control fixing yourself), you can exclude it specifically and still scan the rest
    // of the page.
    test('accessibility of page (excluding element with known issues)', async ({ browserName, page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
            .exclude('#example-accessibility-violations')
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();
            
        await exportAxeAsSarifTestResult('index-except-examples.sarif', accessibilityScanResults, browserName);

        expect(accessibilityScanResults.violations).toEqual([]);
    });

    // If you want to more precisely baseline a particular set of known issues, you can extract a "fingerprint"
    // for each issue and test whether the set of fingerprints found matches the set you already know about.
    test('accessibility of page should match snapshot', async ({ browserName, page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();

        await exportAxeAsSarifTestResult('index-page.sarif', accessibilityScanResults, browserName);

        // We recommend pinning your known failure cases using fingerprints, rather than pinning the entire
        // contents of the violation objects. Violation objects include contextual information like "a snippet
        // of the HTML containing the violation", so snapshotting entire violation objects is prone to failing
        // when unrelated changes are made to the element (or even to unrelated ancestors of the element in
        // the DOM).
        //
        // This technique will have the side effect of test failures only showing the fingerprint, rather than
        // the entire violation, when an unexpected failure occurs. You can still use the exported .sarif files
        // to see complete failure information in a SARIF viewer (https://sarifweb.azurewebsites.net/#Viewers)
        // or a text editor.
        const violationFingerprints = accessibilityScanResults.violations.map(getViolationFingerprint);
        
        expect(violationFingerprints).toEqual([
            {
                "rule": "aria-roles",
                "targets": [[ "span[role=\"invalid\"]" ]],
            },
            {
                "rule": "color-contrast",
                "targets": [[ "li:nth-child(2) > span" ]],
            },
            {
                "rule": "label",
                "targets": [[ "input" ]]
            }
        ]);
    });
});

// You can make your "fingerprint" function as specific as you like. This one considers a violation to be
// "the same" if it corresponds the same Axe rule on the same set of elements.
const getViolationFingerprint = (violation: Axe.Result) => ({
    rule: violation.id,
    targets: violation.nodes.map(node => node.target),
});
