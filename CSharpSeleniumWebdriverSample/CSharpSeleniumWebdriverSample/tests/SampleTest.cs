// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using OpenQA.Selenium.Chrome;
using OpenQA.Selenium.Firefox;
using OpenQA.Selenium.Support.UI;
using System;
using System.IO;
using Selenium.Axe;

namespace CSharpSeleniumWebdriverSample.Test
{
    [TestClass]
    [DeploymentItem("samplePage.html")]
    [DeploymentItem("chromedriver.exe")]
    [DeploymentItem("geckodriver.exe")]
    [TestCategory("SamplePipelineTest")]
    public class SampleTest
    {
        private IWebDriver _webDriver;
        private WebDriverWait _wait;
        private const string MainElementSelector = "main";
        private const int TimeOutInSeconds = 20;

        [TestCleanup]
        public virtual void TearDown()
        {
            _webDriver?.Quit();
            _webDriver?.Dispose();
        }


        [TestMethod]
        [DataRow("Chrome")]
        [DataRow("Firefox")]
        public void RunScanOnGivenElement(string browser)
        {
            string samplePageURL = @"src\samplePage.html";
            string integrationTestTargetFile = Path.GetFullPath(samplePageURL);
            string integrationTestTargetUrl = new Uri(integrationTestTargetFile).AbsoluteUri;
            
            this.InitDriver(browser);
            LoadTestPage(integrationTestTargetUrl);

            string elementSelector1 = "ul";
            int expectedNumberOfViolation1 = 2;
            AxeResult results1 = RunScanOnGivenElementBySelector(elementSelector1);
            Assert.AreEqual(expectedNumberOfViolation1, results1.Violations.Length);

            string elementSelector2 = "ol";
            int expectedNumberOfViolation2 = 1;
            AxeResult results2 = RunScanOnGivenElementBySelector(elementSelector2);
            Assert.AreEqual(expectedNumberOfViolation2, results2.Violations.Length);
        }

        private AxeResult RunScanOnGivenElementBySelector(string elementSelector)
        {
            var selectedElement = _wait.Until(drv => drv.FindElement(By.TagName(elementSelector)));

            return _webDriver.Analyze(selectedElement);
        }


        private void LoadTestPage(string integrationTestTargetUrl)
        {
            _webDriver.Navigate().GoToUrl(integrationTestTargetUrl);

            _wait.Until(drv => drv.FindElement(By.TagName(MainElementSelector)));
        }

        private void InitDriver(string browser)
        {
            switch (browser.ToUpper())
            {
                //In case using Chrome Web Driver
                case "CHROME":
                    // Check if Chrome web driver eniroment varibale already defined so that Chrome version and the webdriver are the same, other wise use Selenium.WebDriver.ChromeDriver to indtall it
                    var chromeDriverDirectory = Environment.GetEnvironmentVariable("ChromeWebDriver") ?? Environment.CurrentDirectory;
                    ChromeOptions options = new ChromeOptions
                    {
                        UnhandledPromptBehavior = UnhandledPromptBehavior.Accept,
                    };
                    options.AddArgument("no-sandbox");
                    options.AddArgument("--log-level=3");
                    options.AddArgument("--silent");

                    ChromeDriverService service = ChromeDriverService.CreateDefaultService(chromeDriverDirectory);
                    service.SuppressInitialDiagnosticInformation = true;
                    _webDriver = new ChromeDriver(chromeDriverDirectory, options);

                    break;
                // Incase Using Firefox
                case "FIREFOX":
                    // Check if Gecko web driver eniroment varibale already defined so that Firefox version and the webdriver are the same, other wise use Selenium.WebDriver.GeckoDriver to indtall it
                    var geckoDriverDirectory = Environment.GetEnvironmentVariable("GeckoWebDriver") ?? Environment.CurrentDirectory;
                    _webDriver = new FirefoxDriver(geckoDriverDirectory);
                    break;

                default:
                    throw new ArgumentException($"Remote browser type '{browser}' is not supported");

            }

            _wait = new WebDriverWait(_webDriver, TimeSpan.FromSeconds(TimeOutInSeconds));
            _webDriver.Manage().Timeouts().AsynchronousJavaScript = TimeSpan.FromSeconds(TimeOutInSeconds);
            _webDriver.Manage().Window.Maximize();
        }
    }
}
