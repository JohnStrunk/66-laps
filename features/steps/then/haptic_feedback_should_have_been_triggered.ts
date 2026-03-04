import { CustomWorld } from '../../support/world';
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

interface CustomWindow extends Window {
  __VIBRATE_CALLS__: number[][];
}

Then('haptic feedback should have been triggered', async function (this: CustomWorld) {
  const vibrateCalls = await this.page!.evaluate(() => (window as unknown as CustomWindow).__VIBRATE_CALLS__.length);
  expect(vibrateCalls > 0, 'Haptic feedback (navigator.vibrate) was not triggered').toBeTruthy();
});
