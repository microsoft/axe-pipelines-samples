// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using OpenQA.Selenium;
using OpenQA.Selenium.Firefox;
using System;

namespace CSharpSeleniumWebdriverSample
{
    public class FirefoxWebdriver : IWebdriver
    {
        public IWebDriver CreateWebdriver()
        {
            // Check if Gecko web driver eniroment varibale already defined so that Firefox version and the webdriver are the same, other wise use Selenium.WebDriver.GeckoDriver to indtall it
            var geckoDriverDirectory = Environment.GetEnvironmentVariable("GeckoWebDriver") ?? Environment.CurrentDirectory;
            return new FirefoxDriver(geckoDriverDirectory);
        }
    }
}
