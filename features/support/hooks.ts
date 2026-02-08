import { Before, After, BeforeAll, AfterAll, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium, Browser } from 'playwright';
import { CustomWorld } from './world';

// Increase timeout for E2E tests
setDefaultTimeout(30 * 1000);

let globalBrowser: Browser | undefined;

BeforeAll(async function () {
  // Browser will be launched on demand in the first @browser scenario
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
});

After({ tags: '@browser' }, async function (this: CustomWorld) {
  await this.page?.close();
  await this.context?.close();
  // We do NOT close the browser here as it's shared across scenarios.
});

AfterAll(async function () {
  if (globalBrowser) {
    await globalBrowser.close();
    globalBrowser = undefined;
  }
});
