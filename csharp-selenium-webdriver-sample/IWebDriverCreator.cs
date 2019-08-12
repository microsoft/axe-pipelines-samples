// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using OpenQA.Selenium;

namespace CSharpSeleniumWebdriverSample
{
    public interface IWebDriverCreator
    {
        IWebDriver CreateWebDriver();
    }
}
