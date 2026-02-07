import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('the lockout duration should be {int} seconds', async function (this: CustomWorld, seconds: number) {
  const stateLockout = await this.page!.evaluate(() => {
    const state = (window as any).__bellLapStore.getState();
    const config: Record<string, number> = {
      '500 SC': 15, '1000 SC': 15, '1650 SC': 15, '800 LC': 30, '1500 LC': 30
    };
    return config[state.event];
  });
  assert.strictEqual(stateLockout, seconds, `Expected lockout to be ${seconds}s but got ${stateLockout}s`);
});
