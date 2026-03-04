import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('a simulated mobile device should be visible', async function (this: CustomWorld) {
  const device = this.page!.locator('[data-testid="faux-mobile-device"]');
  await expect(device).toBeVisible();
  await expect(device, 'Simulated mobile device is not visible').toBeVisible();
});
