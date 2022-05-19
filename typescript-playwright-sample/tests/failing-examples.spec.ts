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
            .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
            .analyze();
            
        await exportAxeAsSarifTestResult('index-except-examples.sarif', accessibilityScanResults, browserName);

        expect(accessibilityScanResults.violations).toEqual([]);
    });
});
