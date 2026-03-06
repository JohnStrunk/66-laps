import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('all lane counts should be {int}', async function (this: CustomWorld, count: number) {
  // Wait for all lane counts to become visible and have the text
  const locators = this.page!.locator('[data-testid="lane-count"]');
  const total = await locators.count();
  for (let i = 0; i < total; i++) {
     await expect(locators.nth(i)).toHaveText(count.toString(), { timeout: 5000 });
  }
});
