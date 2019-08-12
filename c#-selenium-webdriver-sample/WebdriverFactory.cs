// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using OpenQA.Selenium;

namespace CSharpSeleniumWebdriverSample
{
    public class WebdriverFactory
    {
        public static IWebDriver GetWebdriver(BrowserType browser)
        {
            IWebdriver webdriver = null;

            switch (browser)
            {
                //In case using Chrome Web Driver
                case BrowserType.Chrome:
                    webdriver = new ChromeWebdriver();
                    break;

                // Incase Using Firefox
                case BrowserType.Firefox:
                    webdriver = new FirefoxWebdriver();
                    break;
            }

            return webdriver.CreateWebdriver();
        }
    }
}
