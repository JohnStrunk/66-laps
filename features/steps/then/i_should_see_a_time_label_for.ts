import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('I should see a time label for {string}', async function (this: CustomWorld, time: string) {
  const label = this.page!.locator(`[data-testid="time-label-${time}"]`);
  await expect(label).toBeVisible();
  await expect(label).toHaveText(time);
});
