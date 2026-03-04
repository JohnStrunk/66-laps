import { CustomWorld } from '../../support/world';
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

interface CustomWindow extends Window {
  __VIBRATE_CALLS__: number[][];
}

Then('haptic feedback should have been triggered exactly {int} time(s)', async function (this: CustomWorld, count: number) {
  const vibrateCalls = await this.page!.evaluate(() => (window as unknown as CustomWindow).__VIBRATE_CALLS__.length);
  expect(vibrateCalls, `Haptic feedback was triggered ${vibrateCalls} times, but expected ${count}`).toBe(count);
});
