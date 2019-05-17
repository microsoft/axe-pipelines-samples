// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
    preset:'ts-jest',
    testEnvironment: 'node',
    reporters: [
        // This is for console output. Using jest-standard-reporter instead of 'default'
        // works around https://github.com/facebook/jest/issues/5064
        'jest-standard-reporter',

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
