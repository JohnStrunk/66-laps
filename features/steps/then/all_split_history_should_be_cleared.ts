import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';
import { expect } from '@playwright/test';

Then('all split history should be cleared', async function (this: CustomWorld) {
  const historyEmpty = await this.page!.evaluate(() => {
    return (window as unknown as TestWindow).__bellLapStore.getState().lanes.every((l) => l.history.length === 0);
  });
  expect(historyEmpty, 'Split history should be empty after reset').toBeTruthy();
});
