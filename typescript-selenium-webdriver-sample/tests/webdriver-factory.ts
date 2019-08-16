// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import * as webdriver from 'selenium-webdriver';
import * as chrome from 'selenium-webdriver/chrome';
import * as firefox from 'selenium-webdriver/firefox';
import * as path from 'path';

// These declarations are only required because @types/selenium-webdriver is incomplete
// See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/...
declare module 'selenium-webdriver' {
    interface Builder {
        setChromeService(serviceBuilder: chrome.ServiceBuilder): Builder
        setFirefoxService(serviceBuilder: firefox.ServiceBuilder): Builder
    }
}
declare module 'selenium-webdriver/firefox' {
    interface Options {
        headless(): Options
    }
}

export function createWebdriverFromEnvironmentVariableSettings(): webdriver.ThenableWebDriver {
    // Selenium WebDriver implementations generally require that you use a version of the webdriver
    // that exactly matches the version of the browser it is driving.
    //
    // In our Azure Pipelines build agents, using the pre-installed versions of the webdrivers that
    // match the pre-installed versions of the browsers. To achieve this, we check for whether the
    // environment variables ChromeWebDriver/GeckoWebDriver are defined and use those paths if so;
    // the vmImages we use in azure-pipelines.yml come with those environment variables pre-set.
    // See https://docs.microsoft.com/en-us/azure/devops/pipelines/test/continuous-test-selenium
    //
    // During local development, using the chromedriver and geckodriver npm packages to pull down
    // the web drivers, and keeping their versions up to date with the current stable versions of
    // Chrome/Firefox. This strategy means individual developers on your team won't have to manually
    // keep separate global webdriver installations up to date.
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