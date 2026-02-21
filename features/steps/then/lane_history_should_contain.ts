import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow, LapEvent } from '../../support/store-type';
import assert from 'node:assert';

Then('lane {int} history should contain a {string} event from {int} to {int}', async function (this: CustomWorld, laneNumber: number, type: string, prev: number, next: number) {
  const events = await this.page!.evaluate((laneNum) => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    const lane = store.getState().lanes.find(l => l.laneNumber === laneNum);
    return lane?.events || [];
  }, laneNumber);

  const found = events.some((e: LapEvent) =>
    e.type === type && e.prevCount === prev && e.newCount === next
  );
  assert.strictEqual(found, true, `Expected event ${type} from ${prev} to ${next} in lane ${laneNumber} history`);
});
