import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the history should still contain {int} races', async function (this: CustomWorld, count: number) {
  const records = this.page!.locator('[data-testid="history-record"]');
  const recordCount = await records.count();
  expect(recordCount).toBe(count);
});
