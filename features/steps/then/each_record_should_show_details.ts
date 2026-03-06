import { expect } from '@playwright/test';
import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Then('each record should show the start time, distance, lane count, event, and heat', async function (this: CustomWorld) {
  const cards = this.page!.locator('[data-testid="history-record"]');
  const count = await cards.count();
  for (let i = 0; i < count; i++) {
    const card = cards.nth(i);
    await expect(card).toHaveText(/SC|LC/);
    await expect(card).toHaveText(/Lanes/);
    await expect(card).toHaveText(/E \d+/);
    await expect(card).toHaveText(/H \d+/);
    await expect(card).toHaveText(/\d+:\d+/);
  }
});
