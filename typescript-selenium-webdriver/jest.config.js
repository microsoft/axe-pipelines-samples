// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
module.exports = {
    preset:'ts-jest',
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: ['./**/*.ts', '!./**/*.test.ts'],
    coverageDirectory: './test-results/coverage',
    coverageReporters: ['json', 'lcov', 'text', 'cobertura'],
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
