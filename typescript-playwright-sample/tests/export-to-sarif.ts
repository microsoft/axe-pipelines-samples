// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as Axe from 'axe-core';
import { convertAxeToSarif } from 'axe-sarif-converter';
import * as fs from 'fs';
import * as path from 'path';
import { promisify } from 'util';

// SARIF is a general-purpose log format for code analysis tools.
//
// Exporting axe results as .sarif files lets our Azure Pipelines build results page show a nice visualization
// of any accessibility failures we find using the Sarif Results Viewer Tab extension
// (https://marketplace.visualstudio.com/items?itemName=sariftools.sarif-viewer-build-tab)
export async function exportAxeAsSarifTestResult(sarifFileName: string, axeResults: Axe.AxeResults, browserName: string): Promise<void> {
    // We use the axe-sarif-converter package for the conversion step, then write the results
    // to a file that we'll be publishing from a CI build step in azure-pipelines.yml
    const sarifResults = convertAxeToSarif(axeResults);

    // This directory should be .gitignore'd and should be published as a build artifact in azure-pipelines.yml
    const testResultsDirectory = path.join(__dirname, '..', 'test-results', browserName);
    await promisify(fs.mkdir)(testResultsDirectory, { recursive: true });

    const sarifResultFile = path.join(testResultsDirectory, sarifFileName);
    await promisify(fs.writeFile)(
        sarifResultFile,
        JSON.stringify(sarifResults, null, 2));

    console.log(`Exported axe results to ${sarifResultFile}`);
}
