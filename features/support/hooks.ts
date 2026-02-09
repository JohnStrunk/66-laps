import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser } from 'playwright';
import { CustomWorld } from './world';
import { join } from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';

// Increase timeout for E2E tests
setDefaultTimeout(30 * 1000);

let globalBrowser: Browser | undefined;
const COVERAGE_DIR = join(process.cwd(), 'test-results', 'coverage');

BeforeAll(async function () {
  if (!existsSync(COVERAGE_DIR)) {
    mkdirSync(COVERAGE_DIR, { recursive: true });
  }
});

Before({ tags: '@browser' }, async function (this: CustomWorld) {
  if (!globalBrowser) {
    globalBrowser = await chromium.launch({ headless: true });
  }

  // We still provide the browser to the world for convenience,
  // though we don't close it in After.
  this.browser = globalBrowser;

  this.context = await this.browser.newContext({
    viewport: { width: 1280, height: 800 } // Large enough to not trigger fullscreen
  });
  this.page = await this.context.newPage();
  await this.page.clock.install();

  // Start coverage collection
  await this.page.coverage.startJSCoverage();
});

After({ tags: '@browser' }, async function (this: CustomWorld, scenario) {
  if (this.page) {
    const coverage = await this.page.coverage.stopJSCoverage();
    const scenarioName = scenario.pickle.name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    writeFileSync(
      join(COVERAGE_DIR, `coverage-${scenarioName}-${Date.now()}.json`),
      JSON.stringify(coverage)
    );
    await this.page.close();
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
