# typescript-selenium-webdriver-sample

This sample demonstrates how you might set up a CI build for a simple, static html page to perform end to end accessibility tests in a browser, including how to suppress pre-existing or third-party failures using [Jest Snapshot Testing](https://jestjs.io/docs/en/snapshot-testing). 

This sample uses Selenium WebDriver for browser automation and uses the corresponding axe-webdriverjs library to integrate Axe and Selenium. But you don't have to use Selenium to use Axe! If you prefer a different browser automation tool, you can still follow the same concepts from this sample by using the integration library appropriate for your framework:

* For **Puppeteer**, use [axe-puppeteer](https://www.npmjs.com/package/axe-puppeteer)
* For **Cypress**, use [cypress-axe](https://www.npmjs.com/package/cypress-axe)
* For **WebdriverIO**, use [axe-webdriverio](https://www.npmjs.com/package/axe-webdriverio)
* For **Protractor**, keep using axe-webdriverjs like the sample shows, but instead of creating your own Webdriver object, pass [`browser.webdriver`](https://www.protractortest.org/#/api?view=ProtractorBrowser) to axe-webdriverjs.

## Getting Started

The individual files in the sample contain comments that explain the important parts of each file in context.

Some good places to start reading are:

* [tests/index.test.ts](./tests/index.test.ts): Jest test file that opens [src/index.html](./src/index.html) in a browser with Selenium and runs accessibility scans against it with axe-webdriverjs
* [azure-pipelines.yml](./azure-pipelines.yml): Azure Pipelines config file that sets up our Continuous Integration and Pull Request builds
* [jest.config.js](./jest.config.js): Jest configuration file that enables TypeScript (using ts-jest) and test result reporting in Azure Pipelines (using jest-junit)

## Tools and libraries used

* [TypeScript](https://www.typescriptlang.org/) to author our test code
* [Jest](https://jestjs.io/) as our test framework, with [Jest Snapshot Testing](https://jestjs.io/docs/en/snapshot-testing) for baselining and [ts-jest](https://www.npmjs.com/package/ts-jest) for TypeScript support
* [selenium-webdriver](https://www.npmjs.com/package/selenium-webdriver) to automate browsing to the page from the tests
* [node-chromedriver](https://github.com/giggio/node-chromedriver) to enable Selenium to drive Chrome
* [axe-webdriverjs](https://github.com/dequelabs/axe-webdriverjs) to run an axe accessibility scan on the page from the Selenium browser
* [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/) to run the tests in a CI build with every Pull Request
* [axe-sarif-converter](https://github.com/microsoft/axe-sarif-converter) to convert axe results to SARIF format
* [Sarif Viewer Build Tab](https://marketplace.visualstudio.com/items?itemName=sariftools.sarif-viewer-build-tab) to visualize the results in Azure Pipelines

## See it in action in Azure Pipelines

[![Build Status](https://dev.azure.com/accessibility-insights/axe-pipelines-samples/_apis/build/status/25?branchName=master)](https://dev.azure.com/accessibility-insights/axe-pipelines-samples/_build/latest?definitionId=25&branchName=master)

<!--
  Note to maintainers: The below example images/links come from a specific build instead of the most recent build so we can link to specific tabs.
  If you update the links such that they point to a different build, make sure to mark that build as Retained so the links don't expire in a month.
-->
The accessibility tests run as part of the `yarn test` build step:

[![Screenshot of "yarn test" build logs in sample build](./assets/screenshot-logs-tab.png)](https://dev.azure.com/accessibility-insights/axe-pipelines-samples/_build/results?buildId=2228)

The test pass/fail results display in the Tests tab of the build logs:

[![Screenshot of Tests tab in sample build](./assets/screenshot-tests-tab.png)](https://dev.azure.com/accessibility-insights/axe-pipelines-samples/_build/results?buildId=2228&view=ms.vss-test-web.build-test-results-tab)

Detailed accessibliity scan information also appears in the Scans tab, courtesy of the [Sarif Viewer Build Tab extension](https://marketplace.visualstudio.com/items?itemName=sariftools.sarif-viewer-build-tab):

[![Screenshot of Scans tab in sample build](./assets/screenshot-scans-tab.png)](https://dev.azure.com/accessibility-insights/axe-pipelines-samples/_build/results?buildId=2228&view=sariftools.sarif-viewer-build-tab.sariftools.sarif-viewer-build-tab)

## See it in action on your local machine

1. Install the stable version of [Chrome](https://www.google.com/chrome/)
1. Clone this sample repository

   ```sh
   git clone https://github.com/microsoft/axe-pipelines-samples
   ```

1. Install the dependencies

   ```sh
   cd ./axe-pipelines-samples/typescript-selenium-webdriver-sample
   yarn install # or npm install, whichever your project prefers
   ```

1. Run the tests!

   ```sh
   yarn test # or npm test
   ```

   ![Screenshot of yarn test command showing all tests passing](./assets/screenshot-yarn-test-success.png)
