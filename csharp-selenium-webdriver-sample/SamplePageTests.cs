// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using System;
using System.IO;
using Selenium.Axe;

namespace CSharpSeleniumWebdriverSample
{
    [TestClass]
    public class SamplePageTests
    {
        private static IWebDriver _webDriver;

        [ClassInitialize]
        public static void StartBrowser(TestContext _) {
            // Create a web driver based on the bowser type which is either Chrome of Firefox
            _webDriver = WebDriverFactory.CreateFromEnvironmentVariableSettings();
            // Wait for 20 seconds when the driver is looking for an element eg: _webDriver.FindElement(By.TagName(elementSelector)); 
            _webDriver.Manage().Timeouts().ImplicitWait = TimeSpan.FromSeconds(20);
            // Wait for 20 seconds when the driver is executing an asynchronism script
            _webDriver.Manage().Timeouts().AsynchronousJavaScript = TimeSpan.FromSeconds(20);
        }

        [ClassCleanup]
        public static void StopBrowser()
        {
            // You should quit the driver on TearDown which will close every associated window.
            _webDriver?.Quit();
        }

        [TestInitialize]
        public void LoadTestPage() {
            // For simplicity, we're pointing our test browser directly to a static html file on disk.
            // In a project with more complex hosting needs, you might instead start up a localhost http server
            // and then navigate to a http://localhost link.
            string integrationTestTargetFile = Path.GetFullPath(@"SamplePage.html");
            string integrationTestTargetUrl = new Uri(integrationTestTargetFile).AbsoluteUri;

            // Instructs the driver to navigate the browser to the target URL, this should start the browser and open the page in a new window tab
            _webDriver.Navigate().GoToUrl(integrationTestTargetUrl);

            _webDriver.FindElement(By.TagName("main"));
        }

        [TestMethod]
        // This test case shows a basic example: run a scan on an element, return the result, make sure it's as expected.
        // This is the way to go if you have known/pre-existing violations you need to temporarily baseline.
        public void TestAccessibilityOfSingleElement()
        {
            // Find the first element matching the element tag name parameter
            var elementUnderTest = _webDriver.FindElement(By.Id("example-accessibility-violations"));

            //  Instruct the driver to analyze the current element, and return the result as AxeResult object
            var axeResults = new AxeBuilder(_webDriver)
                .Analyze(elementUnderTest);

            // Assert that the number of violations that were found is that what you expect
            Assert.AreEqual(3, axeResults.Violations.Length);
        }

        [TestMethod]
        // This test case shows a basic example: run a scan on an element, return the result, make sure it's as expected.
        // This is the way to go if you have known/pre-existing violations you need to temporarily baseline.
        public void TestAccessibilityPageWithKnownIssues()
        {
            //  Instruct the driver to analyze the current element, and return the result as AxeResult object
            var axeResults = new AxeBuilder(_webDriver)
                .Exclude("#example-accessibility-violations")
                .Analyze();

            // Assert that the number of violations that were found is that what you expect
            Assert.AreEqual(0, axeResults.Violations.Length);
        }

        [TestMethod]
        // This test case shows a basic example: run a scan on an element, return the result, make sure it's as expected.
        // This is the way to go if you have known/pre-existing violations you need to temporarily baseline.
        public void TestWCAGCompliance()
        {
            // Instruct the driver to analyze the current element, and return the result as AxeResult object
            var axeResults = new AxeBuilder(_webDriver)
                .WithTags("wcag2a", "wcag2aa")
                .Analyze();

            // Assert that the number of violations that were found is that what you expect
            Assert.AreEqual(2, axeResults.Violations.Length);
        }
    }
}
