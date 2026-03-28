import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';
import assert from 'node:assert';

Given('lane {int} is active', async function (this: CustomWorld, laneNumber: number) {
  await this.page!.evaluate((laneNum) => {
    const store = (window as unknown as TestWindow).__bellLapStore.getState();
    const lane = store.lanes.find((l) => l.laneNumber === laneNum);
    if (lane?.isEmpty) store.toggleLaneEmpty(laneNum);
  }, laneNumber);

  const isActuallyActive = await this.page!.evaluate((laneNum) => {
    const state = (window as unknown as TestWindow).__bellLapStore.getState();
    const lane = state.lanes.find((l) => l.laneNumber === laneNum);
    return lane ? !lane.isEmpty : false;
  }, laneNumber);

  assert.strictEqual(isActuallyActive, true, `Lane ${laneNumber} failed to be marked as active`);
});
