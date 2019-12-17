
# Axe + Azure Pipelines: Automate accessibility testing in your CI builds

Watch a [short intro video](https://www.youtube.com/watch?v=SarmnCULt8M) to get started with automated accessibility tests in Azure pipelines. Please note that these samples are applicable to web projects that have UI automation tests. Benefits include,
* Automated accessibility tests run during Continuous Integration and Pull Request builds, ensuring that all code changes are free of common easily-detected accessibility issues before they go to production
* Builds can be configured to fail based on the results of the automated accessibility tests, preventing both new accessibility bugs and regressions
* Failure details and _how to fix_ information can be viewed in Azure DevOps under Builds, making it quick and easy to investigate and resolve the accessibility issues

This repository contains sample projects (see next section [Available samples](#available-samples)) demonstrating how to implement automated accessibility testing in [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/) builds using [axe-core](https://github.com/dequelabs/axe-core), the same accessibility scanning engine used in [Accessibility Insights for Web](https://accessibilityinsights.io/docs/en/web/overview).

## Available samples

The following sample projects specify the main technologies used. A team that uses comparable tools and frameworks should be able to refer to the sample and update their existing tests to incorporate automated accessibility checks.

* **[Sample 1: typescript-selenium-webdriver-sample](./typescript-selenium-webdriver-sample)**: 
  * Useful for teams using Selenium and TypeScript/JavaScript. 
  
* **[Sample 2: CSharpSeleniumWebdriverSample](./csharp-selenium-webdriver-sample)**: 
  * Useful for teams using Selenium and C#. 

*Are we missing a sample you'd like to see? [File a sample request](https://github.com/microsoft/axe-pipelines-samples/issues/new?assignees=&labels=sample_request&template=feature_request.md&title=Sample+Request%3A+%3Csample+name+here%3E) or [submit a pull request](./CONTRIBUTING.md)!*

## Disclaimer

Automated accessibility tests can detect some common accessibility problems such as missing or invalid properties. But most accessibility problems can only be discovered through manual testing. We recommend __both__ automated testing, to continuously protect against simple types of issues, and regular manual assessments with [Accessibility Insights for Web](https://accessibilityinsights.io/docs/en/web/overview), a free and open source dev tool that walks you through assessing a website for [WCAG 2.1 AA](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_customize&levels=aaa) coverage.

## Contributing

This project welcomes contributions and suggestions. Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/).
For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or
contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.
