import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';
import { TestWindow } from '../support/store-type';

Then('the Live Leaderboard should be cleared', async function (this: CustomWorld) {
  const allZero = await this.page!.evaluate(() => {
    return (window as unknown as TestWindow).__bellLapStore.getState().lanes.every((l) => l.count === 0);
  });
  assert.ok(allZero, 'Leaderboard counts should be zeroed');
});
