// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import * as path from 'path';
import { exportAxeAsSarifTestResult } from './export-to-sarif';

// This file contains test cases that intentionally fail; you can refer to this project's
// "[failing example] typescript-playwright-sample" Pipeline to see what an accessibility
// failure would look like in a real CI build.
test.describe('[failing example] index.html', () => {

    // This is the same setup as passing-examples.spec.ts; see its comments for details
    test.beforeEach(async ({page}) => {
        const pageUnderTest = 'file://' + path.join(__dirname, '..', 'src', 'index.html');
        await page.goto(pageUnderTest);
        await page.waitForSelector('h1');
    });

    // This test case scans an element which includes a few examples of accessibility violations.
    test('accessibility of elements with issues', async ({ browserName, page }) => {
        const accessibilityScanResults = await new AxeBuilder({ page })
            .include('#example-accessibility-violations')
            .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
            .analyze();
            
        await exportAxeAsSarifTestResult('index-except-examples.sarif', accessibilityScanResults, browserName);

        // We special case PR builds to break the build only if the expected violations are *not* found.
        // This special case is ignored unless the SPECIAL_CASE_PULL_REQUEST_BUILDS environment variable is set to "true".
        // You should **not** set this variable in your pipelines.
        if (IsPullRequestBuild()) {
            expect(accessibilityScanResults.violations).not.toEqual([]);
        } else {
            expect(accessibilityScanResults.violations).toEqual([]);
        }
    });

    function IsPullRequestBuild(): boolean {
        return process.env["SPECIAL_CASE_PULL_REQUEST_BUILDS"] === "true" &&
            process.env["BUILD_SOURCEBRANCH"] !== "refs/heads/main";
    }
});
