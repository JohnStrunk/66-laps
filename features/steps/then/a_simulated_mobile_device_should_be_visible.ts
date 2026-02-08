import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('a simulated mobile device should be visible', async function (this: CustomWorld) {
  const device = this.page!.locator('[data-testid="faux-mobile-device"]');
  await device.waitFor({ state: 'visible' });
  assert.ok(await device.isVisible(), 'Simulated mobile device is not visible');
});
