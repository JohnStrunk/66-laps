import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, ITestCaseHookParameter } from '@cucumber/cucumber';
import { chromium, Browser } from 'playwright';
import { CustomWorld } from './world';
import { join } from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

// Set default timeout to 10 seconds
setDefaultTimeout(10000);

let globalBrowser: Browser | undefined;

BeforeAll(async function () {
  globalBrowser = await chromium.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
});

Before(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  this.scenarioName = scenario.pickle.name;
  this.context = await globalBrowser!.newContext({
    viewport: { width: 1280, height: 720 },
    permissions: ['notifications'],
  });
  this.page = await this.context.newPage();

  // Start coverage collection
  await this.page.coverage.startJSCoverage();

  // Clock is installed by default for all tests to allow advanceClock() usage
  await this.page.clock.install();
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  // Stop coverage and save it
  if (this.page) {
    const coverage = await this.page.coverage.stopJSCoverage();
    const coverageDir = join(process.cwd(), 'test-results', 'coverage');
    if (!existsSync(coverageDir)) {
      mkdirSync(coverageDir, { recursive: true });
    }
    const timestamp = new Date().getTime();
    const scenarioSafeName = scenario.pickle.name.replace(/\s+/g, '_').replace(/[^\w-]/g, '');
    writeFileSync(
      join(coverageDir, `coverage-${scenarioSafeName}-${timestamp}.json`),
      JSON.stringify(coverage)
    );
  }

  if (scenario.result?.status === 'FAILED') {
    const screenshotDir = join(process.cwd(), 'test-results', 'screenshots');
    if (!existsSync(screenshotDir)) {
      mkdirSync(screenshotDir, { recursive: true });
    }
    const screenshotPath = join(screenshotDir, `${scenario.pickle.name.replace(/\s+/g, '_')}.png`);
    const screenshot = await this.page?.screenshot({ path: screenshotPath });
    if (screenshot) {
      this.attach(screenshot, 'image/png');
    }
  }
  await this.context?.close();
  // We do NOT close the browser here as it's shared across scenarios.
});

AfterAll(async function () {
  if (globalBrowser) {
    await globalBrowser.close();
    globalBrowser = undefined;
  }
});
