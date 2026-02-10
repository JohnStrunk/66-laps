import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Then('the total lap count should be {int}', async function (this: CustomWorld, laps: number) {
  if (!this.page) throw new Error('No page found');

  await this.page.waitForFunction((expectedLaps) => {
    const state = (window as unknown as TestWindow).__bellLapStore.getState();
    const config: Record<string, number> = {
      '500 SC': 20, '1000 SC': 40, '1650 SC': 66, '800 LC': 16, '1500 LC': 30
    };
    return config[state.event] === expectedLaps;
  }, laps, { timeout: 5000 });
});
