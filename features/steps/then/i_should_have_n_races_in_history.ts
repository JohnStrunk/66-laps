import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('I should have {int} races in my history', async function (this: CustomWorld, expectedCount: number) {
  const historyCount = await this.page!.evaluate(() => {
    return window.__bellLapStore.getState().history.length;
  });

  expect(historyCount).toBe(expectedCount);
});
