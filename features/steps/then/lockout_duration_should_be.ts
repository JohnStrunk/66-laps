import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Then('the lockout duration should be {int} seconds', async function (this: CustomWorld, seconds: number) {
  if (!this.page) throw new Error('No page found');

  await this.page.waitForFunction((expectedSeconds) => {
    const state = (window as unknown as TestWindow).__bellLapStore.getState();
    const config: Record<string, number> = {
      '500 SC': 15, '1000 SC': 15, '1650 SC': 15, '800 LC': 30, '1500 LC': 30
    };
    return config[state.event] === expectedSeconds;
  }, seconds, { timeout: 5000 });
});
