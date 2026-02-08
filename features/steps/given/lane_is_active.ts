import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('lane {int} is active', async function (this: CustomWorld, laneNumber: number) {
  await this.page!.evaluate((laneNum) => {
    const store = (window as unknown as TestWindow).__bellLapStore.getState();
    const lane = store.lanes.find((l) => l.laneNumber === laneNum);
    if (lane?.isEmpty) store.toggleLaneEmpty(laneNum);
  }, laneNumber);
});
