import { Then, When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'assert';

interface CustomWindow extends Window {
  __VIBRATE_CALLS__: number[][];
}

Then('haptic feedback should have been triggered', async function (this: CustomWorld) {
  const vibrateCalls = await this.page!.evaluate(() => (window as unknown as CustomWindow).__VIBRATE_CALLS__.length);
  assert.ok(vibrateCalls > 0, 'Haptic feedback (navigator.vibrate) was not triggered');
});

Then('haptic feedback should have been triggered exactly {int} time(s)', async function (this: CustomWorld, count: number) {
  const vibrateCalls = await this.page!.evaluate(() => (window as unknown as CustomWindow).__VIBRATE_CALLS__.length);
  assert.strictEqual(vibrateCalls, count, `Haptic feedback was triggered ${vibrateCalls} times, but expected ${count}`);
});

Then('haptic feedback should have been triggered with pattern {string}', async function (this: CustomWorld, expectedPatternJson: string) {
  const expectedPattern = JSON.parse(expectedPatternJson);
  const vibrateCalls = await this.page!.evaluate(() => (window as unknown as CustomWindow).__VIBRATE_CALLS__);

  // Find if any call matches the pattern
  const found = vibrateCalls.some((call: number[]) => JSON.stringify(call) === JSON.stringify(expectedPattern));
  assert.ok(found, `Haptic feedback pattern ${expectedPatternJson} not found in calls: ${JSON.stringify(vibrateCalls)}`);
});

Then('haptic feedback should not have been triggered', async function (this: CustomWorld) {
  const vibrateCalls = await this.page!.evaluate(() => (window as unknown as CustomWindow).__VIBRATE_CALLS__.length);
  assert.strictEqual(vibrateCalls, 0, `Haptic feedback was triggered ${vibrateCalls} times, but expected 0`);
});

When('I clear haptic feedback history', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    (window as unknown as CustomWindow).__VIBRATE_CALLS__ = [];
  });
});
