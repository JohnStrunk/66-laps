import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then('the total lap count should be {int}', async function (this: CustomWorld, laps: number) {
  const stateLaps = await this.page!.evaluate(() => {
    const state = (window as any).__bellLapStore.getState();
    const config: Record<string, number> = {
      '500 SC': 20, '1000 SC': 40, '1650 SC': 66, '800 LC': 16, '1500 LC': 30
    };
    return config[state.event];
  });
  assert.strictEqual(stateLaps, laps, `Expected total laps to be ${laps} but got ${stateLaps}`);
});
