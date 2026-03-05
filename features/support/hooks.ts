import { Before, After, BeforeAll, AfterAll, setDefaultTimeout, ITestCaseHookParameter } from '@cucumber/cucumber';
import { chromium, Browser } from 'playwright';
import { CustomWorld } from './world';
import { join } from 'node:path';
import { existsSync, mkdirSync } from 'node:fs';

// Set default timeout to 30 seconds
setDefaultTimeout(30000);

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

  // Clock is installed by default for all tests to allow advanceClock() usage
  await this.page.clock.install();
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
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
