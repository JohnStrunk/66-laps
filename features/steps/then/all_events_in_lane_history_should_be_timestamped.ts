import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Then('all events in lane {int} history should be timestamped', async function (this: CustomWorld, laneNumber: number) {
  await this.page!.waitForFunction((laneNum) => {
    const store = (window as unknown as TestWindow).__bellLapStore.getState();
    const lane = store.lanes.find((l) => l.laneNumber === laneNum);
    if (!lane || lane.events.length === 0) return false;
    return lane.events.every((e) => typeof e.timestamp === 'number' && e.timestamp > 0);
  }, laneNumber);
});
