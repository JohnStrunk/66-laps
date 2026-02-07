import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import assert from 'node:assert';

Then('the UI should automatically request fullscreen mode', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');

  // Since requestFullscreen() requires a user gesture and might fail in a headless test environment,
  // we might want to check if it's possible to trigger it or if we can mock it.
  // For now, let's try to simulate a click and see if it goes into fullscreen.

  await this.page.click('body');

  // We wait a bit for the transition
  await this.page.waitForTimeout(500);

  const isFullscreen = await this.page.evaluate(() => !!document.fullscreenElement);

  // In some CI environments, fullscreen might not be supported or might behave differently.
  // For now let's see if it works.
  assert.strictEqual(isFullscreen, true);
});
