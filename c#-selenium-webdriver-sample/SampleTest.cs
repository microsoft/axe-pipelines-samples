// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
using System;
using System.IO;
using Selenium.Axe;

namespace CSharpSeleniumWebdriverSample.Test
{
    [TestClass]
    [DeploymentItem("SamplePage.html")]
    [DeploymentItem("chromedriver.exe")]
    [DeploymentItem("geckodriver.exe")]
    public class SampleTest
    {
        private IWebDriver _webDriver;
        private WebDriverWait _wait;

        [TestCleanup]
        public virtual void TearDown()
        {
            _webDriver?.Quit();
        }


        [TestMethod]
        [DataRow(BrowserType.Chrome)]
        [DataRow(BrowserType.Firefox)]
        public void RunScanOnGivenElement(BrowserType browser)
        {
            this.InitDriver(browser);
            LoadTestPage();

            AxeResult results1 = RunScanOnGivenElementBySelector("ul");
            Assert.AreEqual(3, results1.Violations.Length);
        }

        private AxeResult RunScanOnGivenElementBySelector(string elementSelector)
        {
            var selectedElement = _wait.Until(drv => drv.FindElement(By.TagName(elementSelector)));

            return _webDriver.Analyze(selectedElement);
        }


        private void LoadTestPage()
        {
            string integrationTestTargetFile = Path.GetFullPath(@"SamplePage.html");
            string integrationTestTargetUrl = new Uri(integrationTestTargetFile).AbsoluteUri;

            _webDriver.Navigate().GoToUrl(integrationTestTargetUrl);
            _wait.Until(drv => drv.FindElement(By.TagName("main")));
        }

        private void InitDriver(BrowserType browser)
        {
            _webDriver = WebdriverFactory.GetWebdriver(browser);
            _wait = new WebDriverWait(_webDriver, TimeSpan.FromSeconds(20));
            _webDriver.Manage().Timeouts().AsynchronousJavaScript = TimeSpan.FromSeconds(20);
        }
    }
}
