// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using OpenQA.Selenium;

namespace CSharpSeleniumWebdriverSample
{
    public class WebDriverFactory
    {
        public static IWebDriver GetWebDriver(BrowserType browser)
        {
            IWebDriverCreator webDriverCreator = null;

            switch (browser)
            {
                case BrowserType.Chrome:
                    webDriverCreator = new ChromeWebDriverCreator();
                    break;

                case BrowserType.Firefox:
                    webDriverCreator = new FirefoxWebDriverCreator();
                    break;
            }

            return webDriverCreator.CreateWebDriver();
        }
    }
}
