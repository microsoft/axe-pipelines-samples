// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

// This sample happens to use .NET Core, but you can use whichever .NET version makes sense for your project.
// Everything we're demonstrating would also work in .NET Framework 4.5+ with no modifications.
using System;
using System.IO;
// This sample happens to use MSTest, but you can use whichever test framework you like.
// Everything we're demonstrating would also work with xUnit, NUnit, or any other test framework.
using Microsoft.VisualStudio.TestTools.UnitTesting;
// If you're using Selenium already, you're probably already using these.
using OpenQA.Selenium;
using OpenQA.Selenium.Support.UI;
// These are the important new libraries we're demonstrating.
// You'll probably need to add new NuGet package references for these.
using Selenium.Axe;
using FluentAssertions;

namespace CSharpSeleniumWebdriverSample
{
    [TestClass]
    public class SamplePageTests
    {
        #region Example test methods

        // This test case shows the most basic example: run an accessibility scan on a page and assert that there are no violations.
        [TestMethod]
        [TestCategory("IntentionallyFailsAsAnExample")]
        public void TestAccessibilityOfPage()
        {
            AxeResult axeResult = new AxeBuilder(_webDriver).Analyze();

            // axeResult.Violations is an array of all the accessibility violations the scan found; the easiest way to assert
            // that a scan came back clean is to assert that the Violations array is empty. You can do this with the built in
            // MSTest assertions like this:
            //
            //     Assert.AreEqual(0, axeResult.Violations.Length);
            //
            // However, we don't recommend using Assert.AreEqual for this because it doesn't give very useful error messages if
            // it does detect a violation; the error message will just say "expected 0 but found 1".
            //
            // We recommend using FluentAssertions instead; its default behavior gives much better error messages that include
            // full descriptions of accessibility issues, including links to detailed guidance at https://dequeuniversity.com
            // and CSS selector paths that exactly identify the element on the page with the issue.
            axeResult.Violations.Should().BeEmpty();
        }

        // This test case shows 2 options for scanning specific elements within a page, rather than an entire page.
        [TestMethod]
        public void TestAccessibilityOfIndividualElements()
        {
            // Both of these 2 options work equally well; which one to use is a matter of preference.

            // Option 1: using Selenium's FindElement to identify the element to test
            //
            // This can be simpler if your test already had to find the element for earlier assertions, or if you want to test
            // an element that is hard to identify using a CSS selector.
            IWebElement elementUnderTest = _webDriver.FindElement(By.Id("id-of-example-accessible-element"));

            AxeResult axeResultWithAnalyzeWebElement = new AxeBuilder(_webDriver).Analyze(elementUnderTest);

            axeResultWithAnalyzeWebElement.Violations.Should().BeEmpty();

            // Option 2: using AxeBuilder.Include
            //
            // This can be simpler if you need to test multiple elements at once or need to deal with <iframe>s.
            AxeResult axeResultWithInclude = new AxeBuilder(_webDriver)
                .Include("#id-of-example-accessible-element")
                .Include(".class-of-example-accessible-element")
                .Include("#id-of-iframe", "#id-of-element-inside-iframe")
                .Analyze();

            axeResultWithInclude.Violations.Should().BeEmpty();
        }

        // By default, an axe-core scan will check the page under test against a wide variety of different rules. Some of
        // these rules correspond directly to the requirements of different accessibility standards documents (most notably
        // the Web Content Accessibility Guidelines, WCAG); others are best practices, which are generally good ideas but
        // might have allowable exceptions or might not map neatly to a WCAG requirement.
        //
        // This example shows how you would restrict an accessibility scan to only run against *some* of the rules axe-core
        // provides. You can either specify specific rules to enable/disable, or you can use tags to run all of the rules that
        // match a particular tag (axe-core uses tags to indicate whether a rule is a "best practice" vs a WCAG requirement).
        //
        // For complete documentation of which rule IDs and tags axe supports, see:
        // * summary of rules with IDs and tags: https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
        // * full reference documentation for each rule: https://dequeuniversity.com/rules/axe
        [TestMethod]
        public void TestWithOnlyRulesRequiredByWCAG2AA()
        {
            // Axe uses tags to identify which rules are required by WCAG standards. The "wcag2a" tag covers all axe-core rules
            // that correspond to WCAG 2.0 A success criteria, and the "wcag2aa" and "wcag21aa" tags cover those axe-core rules
            // that correspond to WCAG 2.0 and 2.1 AA success criteria.
            //
            // If you wanted to run a scan against *only* those rules corresponding to WCAG 2.0/2.1 A and AA success criteria,
            // omitting any best practice rules not directly applicable to a WCAG criteria, you could run a scan like this:
            AxeResult wcagRequiredResults = new AxeBuilder(_webDriver)
                .WithTags("wcag2a", "wcag2aa", "wcag21aa")
                // The element we're analyzing only has a best-practice violation, not a WCAG violation, so this scan won't flag
                // any Violations.
                .Analyze(_webDriver.FindElement(By.Id("example-best-practice-violation")));

            wcagRequiredResults.Violations.Should().BeEmpty();

            // If you want to be even more granular, you can also use WithRules to scan just certain individual rules.
            //
            // For a complete list of the rules, see:
            // * https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
            // * https://dequeuniversity.com/rules/axe
            AxeResult imageAltResults = new AxeBuilder(_webDriver)
                .WithRules("image-alt")
                // Nothing on our test page violates the image-alt rule, so this scan won't flag any Violations either.
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
            //
            // Exclude accepts any CSS selector; you could also use ".some-classname" or "div[some-attr='some value']"
            AxeResult axeResultExcludingExampleViolationsElement = new AxeBuilder(_webDriver)
                .Exclude("#id-of-example-accessibility-violation-list")
                .Analyze();
            
            axeResultExcludingExampleViolationsElement.Violations.Should().BeEmpty();

            // You can also use AxeBuilder.DisableRules to exclude certain individual rules from a scan. This is particularly
            // useful if you still want to perform *some* scanning on the elements you exclude from more broad scans.
            AxeResult axeResultDisablingRulesViolatedByExamples = new AxeBuilder(_webDriver)
                .Include("#id-of-example-accessibility-violation-list") // Like Exclude(), accepts any CSS selector
                .DisableRules("color-contrast", "label", "tabindex")
                .Analyze();

            axeResultDisablingRulesViolatedByExamples.Violations.Should().BeEmpty();

            // Another option is to assert on the size of the Violations array. This works just fine, but we recommend the
            // other options above as your first choice instead because when they do find new issues, they will produce error
            // messages that more clearly identify exactly what the new/unexpected issues are.
            AxeResult axeResult = new AxeBuilder(_webDriver).Analyze();
            axeResult.Violations.Should().HaveCount(3);
        }

        #endregion

        #region Example setup and cleanup methods

        // The rest of this file shows examples of how to set up an IWebDriver instance to connect to a browser and
        // navigate to a test page.
        //
        // If you're incorporating accessibility testing into an existing body of end to end tests, you can stick with
        // however your existing tests are already solving this; you don't need to do anything special to use Selenium.Axe.

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

        private static IWebDriver _webDriver;

        #endregion
    }
}
