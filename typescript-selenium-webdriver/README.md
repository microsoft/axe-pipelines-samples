# typescript-selenium-webdriver sample

[![Build Status](https://dev.azure.com/accessibility-insights/axe-pipelines-samples/_apis/build/status/typescript-selenium-webdriver%20CI?branchName=master)](https://dev.azure.com/accessibility-insights/axe-pipelines-samples/_build/latest?definitionId=25&branchName=master)
[![Code coverage](https://img.shields.io/azure-devops/coverage/accessibility-insights/axe-pipelines-samples/25.svg)](https://dev.azure.com/accessibility-insights/axe-pipelines-samples/_build/latest?definitionId=25&branchName=master)

This sample demonstrates how you might set up a CI build for a simple html page to perform end to end browser accessibility tests, including how to suppress known failures using a baseline a known set of failures.

The main technologies this sample uses are:
* [express]() to run a localhost web server hosting a static html page
* [typescript]() and [jest]() to write tests of the page
* [selenium-webdriver]() to automate browsing to the page from the tests
* [axe-webdriverjs](https://github.com/dequelabs/axe-webdriverjs) to run an axe accessibility scan on the page from the Selenium browser
* [axe-sarif-converter]() and [Sarif.Multitool]() to compare the scan results to a checked-in baseline
* [Azure Pipelines]() to run the tests in a CI build with every Pull Request
* [Sarif Viewer Build Tab]() to visualize the baselined results in Azure Pipelines
