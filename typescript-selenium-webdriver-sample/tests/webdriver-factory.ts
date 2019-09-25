// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as webdriver from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as firefox from 'selenium-webdriver/firefox';
import * as path from 'path';

export function createWebdriverFromEnvironmentVariableSettings(): webdriver.ThenableWebDriver {
    // Selenium WebDriver implementations generally require that you use a version of the webdriver
    // that exactly matches the version of the browser it is driving.
    //
    // Some Azure Pipelines build agents come pre-installed with common browsers and their matching
    // webdriver versions. To detect whether pre-installed webdrivers are available, we check for
    // whether the environment variables ChromeWebDriver and GeckoWebDriver are defined; the
    // vmImages we use in azure-pipelines.yml come with those environment variables pre-set.
    // See https://docs.microsoft.com/en-us/azure/devops/pipelines/test/continuous-test-selenium
    //
    // For local development, where most developers won't have webdrivers pre-installed, we fall
    // back to the chromedriver and geckodriver npm packages, which come bundled with one particular
    // version of the corresponding webdrivers. These packages need to be kept up to date over time
    // with the current stable versions of Chrome/Firefox. This strategy means individual developers
    // on your team won't have to manually keep separate global webdriver installations up to date.
    const azurePipelinesAgentChromeDriverPath = webdriverPathFromEnvVar('ChromeWebDriver', 'chromedriver.exe');
    const chromeDriverPath = azurePipelinesAgentChromeDriverPath || require('chromedriver').path;

    const azurePipelinesAgentGeckoDriverPath = webdriverPathFromEnvVar('GeckoWebDriver', 'geckodriver.exe');
    const geckoDriverPath = azurePipelinesAgentGeckoDriverPath || require('geckodriver').path;

    return new webdriver.Builder()
        // forBrowser sets the *default* browser the tests will use. You can override the defaults
        // by setting the SELENIUM_BROWSER environment variable. This project's package.json includes
        // two npm run scripts ("test:firefox" and "test:chrome") that show examples of using this.
        .forBrowser('chrome')
        .setChromeService(new chrome.ServiceBuilder(chromeDriverPath))
        // You can run accessibility scans on head-ful browsers, too; we recommend using headless
        // browsers unless your project strictly requires head-ful testing, since it will generally
        // be faster, more reliable, and easier to run in non-graphical environments (eg, Docker).
        .setChromeOptions(new chrome.Options().headless())
        .setFirefoxService(new firefox.ServiceBuilder(geckoDriverPath))
        .setFirefoxOptions(new firefox.Options().headless())
        .build();
}

// selenium-webdriver expects paths like "C:\webdrivers-dir\webdriver.exe", but the Azure Pipelines
// environment variables are in form "C:\webdrivers-dir" - this formats them like Selenium expects
function webdriverPathFromEnvVar(directoryEnvironmentVariable: string, binary: string): (string | null) {
    const directory = process.env[directoryEnvironmentVariable];
    return directory ? path.join(directory, binary) : null;
}
