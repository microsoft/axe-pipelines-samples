# CSharpWindowsAppSample

Windows apps can be tested using the tools in the [axe.windows](https://github.com/microsoft/axe-windows) repo. These tools do not currently produce Sarif files. The general pattern is as follows:

- Use your favorite framework to get your application to the point where it's ready to test.
- Trigger a test using the Axe.Windows tools.
- Consume the test results as you see fit

## Testing from managed code

If your tests are written in managed code, you can call directly into the automation layer as documented [here](https://github.com/microsoft/axe-windows/blob/master/docs/AutomationReference.md). Results will be returned as a JSON objectj, and you have the option to also create an A11yTest file if errors are found. An example of this usage can be found [here](https://github.com/microsoft/accessibility-insights-windows/tree/master/src/UITests).

## Other testing options

It is also possible to use the Axe.Windows CLI to trigger scans from any scripting system that can start a process. These results will always be returned as an A11yTest file (openable in Accessibility Insights for Windows). Documentation of the CLI can be found [here](https://github.com/microsoft/axe-windows/tree/master/src/CLI).
