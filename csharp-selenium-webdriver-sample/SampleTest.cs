// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using System;
using System.IO;
using Selenium.Axe;

namespace CSharpSeleniumWebdriverSample.Test
{
    [TestClass]
   
    public class SampleTest
    {
        // Instance to control the browser.
        // The OpenQA.Selenium.IWebDriver interface is the main interface to use for testing, which represents an idealized web browser.
        private IWebDriver _webDriver;

        [TestCleanup]
        public virtual void TearDown()
        {
            // You should quit the driver on TearDown which will close every associated window.
            _webDriver?.Quit();
        }


        [TestMethod]
        // First DataRow Attribute will create a new instance of the test method and pass Chrome as a parameter, so it'll test on ChromeDriver
        // Second DataRow Attribute will create a new instance of the test method and pass Firefox as a parameter, so it'll test on FirefoxDriver
        // Instead of unseeing DataRow Attribute, you can create a helper function that takes the browser type as a parameter
        // Then call it twice with 2 different test methods for each browser type
        [DataRow(BrowserType.Chrome)]
        [DataRow(BrowserType.Firefox)]
        // This test case shows a basic example: run a scan on an element, return the result, make sure it's as expected.
        // This is the way to go if you have known/pre-existing violations you need to temporarily baseline.
        public void RunScanOnGivenElement(BrowserType browser)
        {
            this.InitDriver(browser);
            LoadTestPage();

            // Analyze the a known element in the page, and get the results
            AxeResult results = RunScanOnGivenElementByTagName("ul");
            // Assert that the number of violations that were found is that what you expect
            Assert.AreEqual(3, results.Violations.Length);
        }

        private AxeResult RunScanOnGivenElementByTagName(string tagName)
        {
            // Find the first element matching the element tag name parameter
            var selectedElement = _webDriver.FindElement(By.TagName(tagName));

            //  Instruct the driver to analyze the current element, and return the result as AxeResult object
            return _webDriver.Analyze(selectedElement);
        }


        private void LoadTestPage()
        {
            // For simplicity, we're pointing our test browser directly to a static html file on disk.
            // In a project with more complex hosting needs, you might instead start up a localhost http server
            // and then navigate to a http://localhost link.
            string integrationTestTargetFile = Path.GetFullPath(@"SamplePage.html");
            string integrationTestTargetUrl = new Uri(integrationTestTargetFile).AbsoluteUri;

            // Instructs the driver to navigate the browser to the target URL, this should start the browser and open the page in a new window tab
            _webDriver.Navigate().GoToUrl(integrationTestTargetUrl);
        }

        private void InitDriver(BrowserType browser)
        {
            // Create a web driver based on the bowser type which is either Chrome of Firefox
            _webDriver = WebDriverFactory.GetWebDriver(browser);
            // Wait for 20 seconds when the driver is looking for an element eg: _webDriver.FindElement(By.TagName(elementSelector)); 
            _webDriver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(20);
            // Wait for 20 seconds when the driver is executing an asynchronism script
            _webDriver.Manage().Timeouts().AsynchronousJavaScript = TimeSpan.FromSeconds(20);
        }
    }
}
