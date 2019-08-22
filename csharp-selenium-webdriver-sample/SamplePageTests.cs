// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;
using System;
using System.IO;
using Selenium.Axe;
using OpenQA.Selenium.Support.UI;
using FluentAssertions;

namespace CSharpSeleniumWebdriverSample
{
    [TestClass]
    public class SamplePageTests
    {
        private static IWebDriver _webDriver;

        // Starting a new browser process is good for keeping tests isolated from one another, but can be slow. Here, we're
        // using a [ClassInitialize] method so the same browser will be shared between different [TestMethod]s.
        [ClassInitialize]
        public static void StartBrowser(TestContext testContext) {
            // WebDriverFactory uses environment variables set by azure-pipelines.yml to determine which browser to use;
            // the test cases we'll write in this file will work regardless of which browser they're running against.
            //
            // This WebDriverFactory is just one example of how you might initialize Selenium; if you're adding Selenium.Axe
            // to an existing set of end to end tests that already have their own way of initializing a webdriver, you can
            // keep using that instead.
            _webDriver = WebDriverFactory.CreateFromEnvironmentVariableSettings();

            // You *must* set this timeout to use Selenium.Axe. It defaults to "0 seconds", which isn't enough time for
            // Axe to scan the page. The exact amount of time will depend on the complexity of the page you're testing.
            _webDriver.Manage().Timeouts().AsynchronousJavaScript = TimeSpan.FromSeconds(20);
        }

        // It's important to remember to clean up the browser and webdriver; otherwise, the browser process will remain
        // alive after your tests are done, which can cause confusing errors during later builds and/or test sessions.
        [ClassCleanup]
        public static void StopBrowser()
        {
            _webDriver?.Quit();
        }

        // Reloading the test page before every test isn't strictly necessary (since these accessibility scans aren't
        // modifying the page), but is a good practice to default to in the interest of making sure different tests
        // can execute independently.
        [TestInitialize]
        public void LoadTestPage() {
            // For simplicity, we're pointing our test browser directly to a static html file on disk.
            // In a project with more complex hosting needs, you might instead start up a localhost http server
            // and then navigate to a http://localhost link.
            string samplePageFilePath = Path.GetFullPath(@"SamplePage.html");
            string samplePageFileUrl = new Uri(samplePageFilePath).AbsoluteUri;
            _webDriver.Navigate().GoToUrl(samplePageFileUrl);

            // It's a good practice to make sure the page's content has actually loaded *before* running any
            // accessibility tests. This acts as a sanity check that the browser initialization worked and makes
            // sure that you aren't just scanning a blank page.
            new WebDriverWait(_webDriver, TimeSpan.FromSeconds(10))
                .Until(d => d.FindElement(By.TagName("main")));
        }

        // This test case shows the most basic example: run an accessibility scan on an element and assert that there are
        // no violations.
        [TestMethod]
        public void TestAccessibilityOfSingleElement()
        {
            IWebElement elementUnderTest = _webDriver.FindElement(By.Id("example-accessible-element"));

            AxeResult axeResult = new AxeBuilder(_webDriver)
                .Analyze(elementUnderTest);

            // This is the simplest way to assert that the axe scan didn't find any violations. However, if it *does* find
            // some violations, it doesn't give a very useful error message; it just says "expected 0 but found 1".
            Assert.AreEqual(0, axeResult.Violations.Length);

            // We recommend using FluentAssertions instead; its default behavior gives much better error messages that include
            // full descriptions of accessibility issues, including links to detailed guidance at https://dequeuniversity.com
            // and CSS selector paths that exactly identify the element on the page with the issue.
            axeResult.Violations.Should().BeEmpty();
        }

        // This test case shows how to run just a subset of the available axe rules in an accessibility scan.
        // This is useful when just getting started with accessibility testing; you can start with a small set of rules and
        // expand to a more complete set of rules over time.
        [TestMethod]
        public void TestWCAGCompliance()
        {
            // Axe implements checks for many different "rules". Rules usually correspond to specific accessibility standards,
            // like WCAG or Section 508, though some are "best-practice" rules that don't (yet) correspond to a recognized
            // accessibility standard. By default, Axe runs *all* non-experimental rules.
            //
            // If you're adding checks to a page with many existing violations, you might start off with scanning for just the
            // "WCAG A" rules, and later expand to include the "WCAG AA" rules, before finally starting to scan for *all*
            // violations. You can do that with the WithTags method: 
            AxeResult wcag2Results = new AxeBuilder(_webDriver)
                .Include("#example-best-practice-violation") // not a WCAG violation
                .WithTags("wcag2a", "wcag2aa")
                .Analyze();

            wcag2Results.Violations.Should().BeEmpty();

            // If you want to be even more granular, you can also use WithRules to scan just certain individual rules:
            AxeResult imageAltResults = new AxeBuilder(_webDriver)
                .WithRules("image-alt")
                .Analyze();
                
            imageAltResults.Violations.Should().BeEmpty();
        }

        // This test case shows how you might baseline some known/pre-existing accessibility violations from your tests.
        // This is useful when just getting started with accessibility testing, so you can prevent new issues from creeping in
        // while you're still working on fixing any existing issues.
        [TestMethod]
        public void TestAccessibilityOfPageExcludingKnownIssues()
        {
            // You can use AxeBuilder.Exclude to exclude individual elements with known issues from a scan.
            AxeResult axeResultExcludingExampleViolationsElement = new AxeBuilder(_webDriver)
                .Exclude("#example-accessibility-violations")
                .Analyze();
            
            axeResultExcludingExampleViolationsElement.Violations.Should().BeEmpty();

            // You can also use AxeBuilder.DisableRules to exclude certain individual rules from a scan. This is particularly
            // useful if you still want to perform *some* scanning on the elements you exclude from more broad scans.
            AxeResult axeResultDisablingRulesViolatedByExamples = new AxeBuilder(_webDriver)
                .Include("#example-accessibility-violations")
                .DisableRules("color-contrast", "label", "tabindex")
                .Analyze();

            axeResultDisablingRulesViolatedByExamples.Violations.Should().BeEmpty();

            // Another option is to assert on the size of the Violations array. This works just fine, but we recommend the
            // other options above as your first choice instead because when they do find new issues, they will produce error
            // messages that more clearly identify exactly what the new/unexpected issues are.
            AxeResult axeResult = new AxeBuilder(_webDriver).Analyze();
            axeResult.Violations.Should().HaveCount(3);
        }
    }
}
