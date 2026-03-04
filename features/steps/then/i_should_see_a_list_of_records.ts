import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('I should see a list of records', async function (this: CustomWorld) {
  const cards = this.page!.locator('[data-testid="history-record"]');
  await expect(cards.first()).toBeVisible();
  const count = await cards.count();
  expect(count > 0, `Expected some records, found ${count}`).toBeTruthy();
});
