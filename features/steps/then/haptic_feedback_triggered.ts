import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'assert';

Then('haptic feedback should have been triggered', async function (this: CustomWorld) {
  const vibrateCalls = await this.page!.evaluate(() => (window.navigator as any).vibrateCalls.length);
  assert.ok(vibrateCalls > 0, 'Haptic feedback (navigator.vibrate) was not triggered');
});

Then('haptic feedback should have been triggered exactly {int} time(s)', async function (this: CustomWorld, count: number) {
  const vibrateCalls = await this.page!.evaluate(() => (window.navigator as any).vibrateCalls.length);
  assert.strictEqual(vibrateCalls, count, `Haptic feedback was triggered ${vibrateCalls} times, but expected ${count}`);
});

Then('haptic feedback should not have been triggered', async function (this: CustomWorld) {
  const vibrateCalls = await this.page!.evaluate(() => (window.navigator as any).vibrateCalls.length);
  assert.strictEqual(vibrateCalls, 0, `Haptic feedback was triggered ${vibrateCalls} times, but expected 0`);
});
