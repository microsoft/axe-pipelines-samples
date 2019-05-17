// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
    preset:'ts-jest',
    testEnvironment: 'node',
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
