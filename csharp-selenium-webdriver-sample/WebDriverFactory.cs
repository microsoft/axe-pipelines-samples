﻿// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using System;

namespace CSharpSeleniumWebdriverSample
{
    // Enum for the browser types
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
                    //  Check if Chrome web driver environment variable already defined so that Chrome version and the webdriver are the same, otherwise use Selenium.WebDriver.ChromeDriver to install it                    
                    var chromeDriverDirectory = Environment.GetEnvironmentVariable("ChromeWebDriver") ?? Environment.CurrentDirectory;
                    //  Initializes a new ChromeDriver using the specified path to the directory containing ChromeDriver.exe.
                    return new ChromeDriver(chromeDriverDirectory);

                case BrowserType.Firefox:
                    //  Check if Gecko web driver environment variable already defined so that Firefox version and the webdriver are the same, otherwise use Selenium.WebDriver.GeckoDriver to install it                    
                    var geckoDriverDirectory = Environment.GetEnvironmentVariable("GeckoWebDriver") ?? Environment.CurrentDirectory;
                    //  Initializes a new FirefoxDriver using the specified path to the directory containing GeckoDriver.exe
                    return new FirefoxDriver(geckoDriverDirectory);

                default:
                    throw new ArgumentException($"Unknown browser type {browser}", nameof(browser));
            }
        }
    }
}
