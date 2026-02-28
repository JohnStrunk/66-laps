import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow, RaceRecord } from '../../support/store-type';
import assert from 'node:assert';

Then('the first race should still be in the history', async function (this: CustomWorld) {
  const history = await this.page!.evaluate(() => {
    return (window as unknown as TestWindow).__bellLapStore.getState().history;
  });

  const ids = history.map((r: RaceRecord) => r.id);
  assert.ok(ids.includes('race-1'), 'Expected race-1 to still be in history');
});
