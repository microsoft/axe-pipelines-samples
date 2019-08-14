// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using System;

namespace CSharpSeleniumWebdriverSample
{
    public enum BrowserType
    {
        Chrome,
        Firefox,
    }

    public class WebDriverFactory
    {
        public static IWebDriver GetWebDriver(BrowserType browser)
        {   
            switch (browser)
            {
                case BrowserType.Chrome:
                    // The ChromeWebDriver environment variable comes pre-set in the Azure Pipelines VM Image we
                    // specify in azure-pipelines.yml. ChromeDriver requires that you use *matching* versions of Chrome and
                    // the Chrome WebDriver; in the build agent VMs, using this environment variable will make sure that we use
                    // the pre-installed version of ChromeDriver that matches the pre-installed version of Chrome.
                    //
                    // See https://docs.microsoft.com/en-us/azure/devops/pipelines/test/continuous-test-selenium
                    //
                    // Environment.CurrentDirectory is where the Selenium.Webdriver.ChromeDriver NuGet package will place the
                    // version of the Chrome WebDriver that it comes with. We fall back to this so that if a developer working on
                    // the project hasn't separately installed ChromeDriver, the test will still be able to run on their machine.
                    var chromeDriverDirectory = Environment.GetEnvironmentVariable("ChromeWebDriver") ?? Environment.CurrentDirectory;

                    // Initializes a new ChromeDriver using the specified path to the directory containing ChromeDriver.exe.
                    return new ChromeDriver(chromeDriverDirectory);

                case BrowserType.Firefox:
                    // The same like above but for Firefox
                    // the pre-set environment variable in the Azure Pipelines VM Image is GeckoWebDriver
                    // the pre-installed version of FirefoxDriver matches the pre-installed version of Firefox
                    // Selenium.WebDriver.GeckoDriver Nuget will place the Firefox WebDriver in the Environment.CurrentDirectory.
                    var geckoDriverDirectory = Environment.GetEnvironmentVariable("GeckoWebDriver") ?? Environment.CurrentDirectory;
                    
                    // Initializes a new FirefoxDriver using the specified path to the directory containing GeckoDriver.exe
                    return new FirefoxDriver(geckoDriverDirectory);

                default:
                    throw new ArgumentException($"Unknown browser type {browser}", nameof(browser));
            }
        }
    }
}
