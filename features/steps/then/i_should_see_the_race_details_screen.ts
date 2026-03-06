import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';
import { waitForVisible } from '../../support/utils';

Then('I should see the race details screen', async function (this: CustomWorld) {
  const locator = this.page!.locator('[data-testid="race-details-view"]');
  await waitForVisible(locator);
  expect(await locator.isVisible()).toBe(true);
});
