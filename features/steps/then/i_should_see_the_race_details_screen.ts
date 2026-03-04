import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('I should see the race details screen', async function (this: CustomWorld) {
  const visible = await this.page!.locator('[data-testid="race-details-view"]').isVisible();
  expect(visible).toBe(true);
});
