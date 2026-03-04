import { CustomWorld } from '../../support/world';
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

interface CustomWindow extends Window {
  __VIBRATE_CALLS__: number[][];
}

Then('haptic feedback should have been triggered with pattern {string}', async function (this: CustomWorld, expectedPatternJson: string) {
  const expectedPattern = JSON.parse(expectedPatternJson);
  const vibrateCalls = await this.page!.evaluate(() => (window as unknown as CustomWindow).__VIBRATE_CALLS__);

  // Find if any call matches the pattern
  const found = vibrateCalls.some((call: number[]) => JSON.stringify(call) === JSON.stringify(expectedPattern));
  expect(found, `Haptic feedback pattern ${expectedPatternJson} not found in calls: ${JSON.stringify(vibrateCalls)}`).toBeTruthy();
});
