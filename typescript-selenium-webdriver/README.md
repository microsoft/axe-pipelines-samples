# typescript-selenium-webdriver sample

[![Build Status](https://dev.azure.com/accessibility-insights/axe-pipelines-samples/_apis/build/status/typescript-selenium-webdriver%20CI?branchName=master)](https://dev.azure.com/accessibility-insights/axe-pipelines-samples/_build/latest?definitionId=25&branchName=master)
[![Code coverage](https://img.shields.io/azure-devops/coverage/accessibility-insights/axe-pipelines-samples/25.svg)](https://dev.azure.com/accessibility-insights/axe-pipelines-samples/_build/latest?definitionId=25&branchName=master)

This sample demonstrates how you might set up a CI build for a simple html page to perform end to end browser accessibility tests, including how to suppress known failures using a baseline file.

This tests in the sample rely on having a [Selenium](https://www.seleniumhq.org/) WebDriver binary available on your PATH. These binaries are [available by default in many Azure Pipelines hosted agents](https://docs.microsoft.com/en-us/azure/devops/pipelines/test/continuous-test-selenium), but you may need to install them yourself ([ChromeDriver](http://chromedriver.chromium.org/downloads), [geckodriver](https://github.com/mozilla/geckodriver)) to run the tests on your local machine or in a custom build agent.

The main technologies this sample uses are:

* [http-server](https://www.npmjs.com/package/http-server) to run a localhost web server hosting a static html page
* [typescript](https://www.typescriptlang.org/) and [jest](https://jestjs.io/) to write tests of the page
* [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver) to automate browsing to the page from the tests
* [axe-webdriverjs](https://github.com/dequelabs/axe-webdriverjs) to run an axe accessibility scan on the page from the Selenium browser
* [axe-sarif-converter](https://github.com/microsoft/axe-sarif-converter) and [Sarif.Multitool](https://www.nuget.org/packages/Sarif.Multitool) to compare the scan results to a checked-in baseline
* [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/) to run the tests in a CI build with every Pull Request
* [Sarif Viewer Build Tab](https://marketplace.visualstudio.com/items?itemName=sariftools.sarif-viewer-build-tab) to visualize the baselined results in Azure Pipelines
