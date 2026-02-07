import { Given } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';
import { selectEvent } from '../support/utils';
import { TestWindow } from '../support/store-type';

Given(/^the race is a (.*) event \((\d+) laps total\)$/, async function (this: CustomWorld, eventName: string, laps: number) {
  await selectEvent(this.page!, eventName);

  const stateLaps = await this.page!.evaluate(() => {
    const state = (window as unknown as TestWindow).__bellLapStore.getState();
    const config: Record<string, number> = {
      '500 SC': 20, '1000 SC': 40, '1650 SC': 66, '800 LC': 16, '1500 LC': 30
    };
    return config[state.event];
  });
  assert.strictEqual(stateLaps, laps, `Failed to configure event ${eventName}. Store has ${stateLaps} laps instead of ${laps}`);
});
