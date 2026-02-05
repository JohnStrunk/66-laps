import { Before, After, setDefaultTimeout } from '@cucumber/cucumber';
import { chromium } from 'playwright';
import { CustomWorld } from './world';

// Increase timeout for E2E tests
setDefaultTimeout(30 * 1000);

Before(async function (this: CustomWorld) {
  // Only launch browser if we don't have one (though Cucumber creates a new World for each scenario usually)
  // For unit tests (SwimmerModel), we technically don't need a browser,
  // but detecting which test is running inside the hook requires tags.
  // We'll launch it for now.
  this.browser = await chromium.launch({ headless: true });
  this.context = await this.browser.newContext();
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld) {
  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});
