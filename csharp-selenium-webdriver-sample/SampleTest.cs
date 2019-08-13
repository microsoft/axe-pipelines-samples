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
    //  Install chromedriver to enable Chrome broswer and copy it to the same directory as the deployed test assemblies.
    [DeploymentItem("chromedriver.exe")]
    //  Install geckodriver to enable Firefox brower and copy it to the same directory as the deployed test assemblies.
    [DeploymentItem("geckodriver.exe")]
    public class SampleTest
    {
        //  Intance to control the browser.
        private IWebDriver _webDriver;

        [TestCleanup]
        public virtual void TearDown()
        {
            //  You should quit the driver on TearDown which close every associated window.
            _webDriver?.Quit();
        }


        [TestMethod]
        // Test on Chrome
        [DataRow(BrowserType.Chrome)]
        //  Test on Firefox
        [DataRow(BrowserType.Firefox)]
        public void RunScanOnGivenElement(BrowserType browser)
        {
            //  Intilaize the driver based on the browser type
            this.InitDriver(browser);
            //  Load the test page
            LoadTestPage();

            //  Analyze the unorder list element in the page, and get the results
            AxeResult results = RunScanOnGivenElementBySelector("ul");
            //  Assert that the number of vilaztions that were found is that what you expect
            Assert.AreEqual(3, results.Violations.Length);
        }

        private AxeResult RunScanOnGivenElementBySelector(string elementSelector)
        {
            //  Find the first element matching the element selector parameter
            var selectedElement = _webDriver.FindElement(By.TagName(elementSelector));

            //  Instruct the driver to analyze the current element, and return the result as AxeResult object
            return _webDriver.Analyze(selectedElement);
        }


        private void LoadTestPage()
        {
            //  For simplicity, we're pointing our test browser directly to a static html file on disk.
            string integrationTestTargetFile = Path.GetFullPath(@"SamplePage.html");
            string integrationTestTargetUrl = new Uri(integrationTestTargetFile).AbsoluteUri;

            //  Instructs the driver to navigate the browser to the target URL, this should start the brower and open the page in a new window tab
            _webDriver.Navigate().GoToUrl(integrationTestTargetUrl);
        }

        private void InitDriver(BrowserType browser)
        {
            //  Create a web driver based on the bowser type which is ehither Chrome of Firefox
            _webDriver = WebDriverFactory.GetWebDriver(browser);
            //  Wait for 20 seconds when the driver is looking for an element eg: _webDriver.FindElement(By.TagName(elementSelector)); 
            _webDriver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(20);
            //  Wait for 20 seconds when the driver is executing an asynchronism script
            _webDriver.Manage().Timeouts().AsynchronousJavaScript = TimeSpan.FromSeconds(20);
        }
    }
}
