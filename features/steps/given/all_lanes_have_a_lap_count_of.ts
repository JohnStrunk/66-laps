import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('all lanes have a lap count of {int}', async function (this: CustomWorld, count: number) {
  await this.page!.evaluate((targetCount) => {
    const store = (window as unknown as TestWindow).__bellLapStore.getState();
    store.lanes.forEach(lane => {
      // Directly update count and history to avoid repeated clicks
      const diff = targetCount - lane.count;
      if (diff === 0) return;
      store.updateLaneCount(lane.laneNumber, diff);
    });
  }, count);
});
