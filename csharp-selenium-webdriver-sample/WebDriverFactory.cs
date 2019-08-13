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
                    // Check if Chrome web driver eniroment varibale already defined so that Chrome version and the webdriver are the same, other wise use Selenium.WebDriver.ChromeDriver to indtall it
                    var chromeDriverDirectory = Environment.GetEnvironmentVariable("ChromeWebDriver") ?? Environment.CurrentDirectory;
                    return new ChromeDriver(chromeDriverDirectory);

                case BrowserType.Firefox:
                    // Check if Gecko web driver eniroment varibale already defined so that Firefox version and the webdriver are the same, other wise use Selenium.WebDriver.GeckoDriver to indtall it
                    var geckoDriverDirectory = Environment.GetEnvironmentVariable("GeckoWebDriver") ?? Environment.CurrentDirectory;
                    return new FirefoxDriver(geckoDriverDirectory);
            }

            return null;
        }
    }
}
