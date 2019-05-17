
# Axe + Azure Pipelines: Automate accessibility testing in your CI builds

Samples demonstrating how to use [axe](https://www.deque.com/axe/) for automated accessibility testing of websites in [Azure Pipelines](https://azure.microsoft.com/en-us/services/devops/pipelines/) builds.

Automated accessibility tests can detect some common accessibility problems such as missing or invalid properties. But most accessibility problems can only be discovered through manual testing. We recommend [Accessibility Insights](https://accessibilityinsights.io/docs/en/web/overview), a free and open source dev tool that walks you though assessing a website for 100% [WCAG 2.0 AA](https://www.w3.org/WAI/WCAG21/quickref/?currentsidebar=%23col_overview&versions=2.0&levels=aaa) coverage.

## Available samples

|Sample|Description|
|------|-----------|
|[typescript-selenium-webdriver](./typescript-selenium-webdriver/README.md)|Uses [jest](https://jestjs.io/), [Selenium](https://www.seleniumhq.org) and [axe for Web](https://www.deque.com/axe/axe-for-web/) to test a web page for accessibility issues. Also demonstrates how to visualize issues and baseline pre-existing failures using [SARIF](https://sarifweb.azurewebsites.net/).

*Are we missing a sample you'd like to see? [File a sample request](https://github.com/microsoft/axe-pipelines-samples/issues/new?assignees=&labels=sample_request&template=feature_request.md&title=Sample+Request%3A+%3Csample+name+here%3E) or [submit a pull request](./CONTRIBUTING.md)!*

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
