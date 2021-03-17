# WindowsAppResources

Windows applications can be scanned for accessibility issues using the tools in the [Axe.Windows](https://github.com/microsoft/axe-windows) repo. These tools do not currently produce Sarif files. The general pattern is as follows:

- Use your favorite framework (eg, [Appium with WinAppDriver](https://github.com/appium/appium/blob/master/docs/en/drivers/windows.md) or similar framework) to get your application to the state that needs to be scanned
- Trigger a scan using the Axe.Windows tools.
- Consume the scan results--this will vary depending on your test framework.

## Testing from .NET code

If your tests are written in .NET Core or .NET Framework, you can trigger a scan by using the [axe-windows automation layer](https://github.com/microsoft/axe-windows/blob/main/docs/AutomationReference.md). Results will be returned as a .NET object, which you can then consume as you wish. You also have the option to automatically create an A11yTest file (openable in [Accessibility Insights for Windows](https://accessibilityinsights.io/docs/en/windows/overview)) if any errors are found. An example of this usage can be found [here](https://github.com/microsoft/accessibility-insights-windows/tree/main/src/UITests). Your project can directly reference the Axe.Windows package from [NuGet](https://www.nuget.org/packages/Axe.Windows/).

## Other testing options

It is possible to use the Axe.Windows CLI to trigger scans from any scripting system that can start a process. These results will always be returned as an A11yTest file. Documentation of the CLI can be found [here](https://github.com/microsoft/axe-windows/tree/main/src/CLI). The Axe.Windows CLI can be downloaded from the [Axe.Windows release page](https://github.com/microsoft/axe-windows/releases/latest).
