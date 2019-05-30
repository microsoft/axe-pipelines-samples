// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
    // These are necessary to use typescript with Jest tests
    preset:'ts-jest',
    testEnvironment: 'node',

    // Using the jest-circus testRunner ensures that tests will not run if beforeAll or beforeEach fails.
    //
    // Since browser automation tests commonly use beforeAll/beforeEach to perform browser/page setup,
    // it's usually misleading to allow tests to continue trying to execute when they have failed.
    //
    // See https://github.com/facebook/jest/issues/2713 for details.
    testRunner: 'jest-circus/runner',

    reporters: [
        // This enables console output for local development and build log output in Pipelines.
        'default',

        // This is to populate the Tests tab on the Build Results page in Azure Pipelines.
        // See the "publish test results" step in ./azure-pipelines.yml.
        [
            'jest-junit',
            {
                outputDirectory: '.',
                outputName: './test-results/junit.xml',
            },
        ],
    ],
};
