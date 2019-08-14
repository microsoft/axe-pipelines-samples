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
                    // So now we need to specify the ChromeDriver directory path
                    // We check first if the enivronemnt variable was set, if so we use the path value
                    // if it's not set, we use Selenium.WebDriver.ChromeDriver nuget to install it in the current directory
                    // chromedriver.exe does not appear in Solution Explorer, but it is copied to bin folder from package folder when the build process.
                    var chromeDriverDirectory = Environment.GetEnvironmentVariable("ChromeWebDriver") ?? Environment.CurrentDirectory;

                    // Initializes a new ChromeDriver using the specified path to the directory containing ChromeDriver.exe.
                    return new ChromeDriver(chromeDriverDirectory);

                case BrowserType.Firefox:
                    // So now we need to specify the FirefoxDriver directory path
                    // We check first if the enivronemnt variable was set, if so we use the path value
                    // if it's not set, we use Selenium.WebDriver.GeckoDriver nuget to install it in the current directory
                    // geckodriver.exe does not appear in Solution Explorer, but it is copied to bin folder from package folder when the build process.           
                    var geckoDriverDirectory = Environment.GetEnvironmentVariable("GeckoWebDriver") ?? Environment.CurrentDirectory;
                    
                    // Initializes a new FirefoxDriver using the specified path to the directory containing GeckoDriver.exe
                    return new FirefoxDriver(geckoDriverDirectory);

                default:
                    throw new ArgumentException($"Unknown browser type {browser}", nameof(browser));
            }
        }
    }
}
