// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const rootDir = './';
const currentDir = '<rootDir>/';

module.exports = {
    testRunner: 'jest-circus/runner',
    transform: {
        '^.+\\.(ts)$': 'ts-jest',
    },
    verbose: false,
    coverageDirectory: './test-results/coverage',
    displayName: 'unit tests',
    moduleFileExtensions: ['ts', 'js'],
    rootDir: rootDir,
    collectCoverage: true,
    collectCoverageFrom: ['./**/*.ts', '!./**/*.test.ts'],
    coverageReporters: ['json', 'lcov', 'text', 'cobertura'],
    testMatch: [`${currentDir}/**/*.test.(ts|js)`],
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