// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using System;

namespace CSharpSeleniumWebdriverSample
{
    public class ChromeWebDriverCreator : IWebDriverCreator
    {
        public IWebDriver CreateWebDriver()
        {
            // Check if Chrome web driver eniroment varibale already defined so that Chrome version and the webdriver are the same, other wise use Selenium.WebDriver.ChromeDriver to indtall it
            var chromeDriverDirectory = Environment.GetEnvironmentVariable("ChromeWebDriver") ?? Environment.CurrentDirectory;
            return new ChromeDriver(chromeDriverDirectory);
        }
    }
}
