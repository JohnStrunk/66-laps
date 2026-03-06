import { expect } from '@playwright/test';
import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Then('I should see a time marker for {string}', async function (this: CustomWorld, time: string) {
  const marker = this.page!.locator(`[data-testid="time-marker-${time}"]`);
  await expect(marker).toBeVisible();
});
