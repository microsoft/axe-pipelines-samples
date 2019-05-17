// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
    preset:'ts-jest',
    testEnvironment: 'node',

    // Outputting in JUnit format is for the benefit of Azure Pipelines' test results view.
    // We publish the JUnit results for it to see from the "publish test results" step in azure-pipelines.yml.
    reporters: [
        'default',
        [
            'jest-junit',
            {
                outputDirectory: '.',
                outputName: './test-results/junit.xml',
            },
        ],
    ],
};
