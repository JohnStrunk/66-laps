import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('all lanes are active', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore.getState();
    store.lanes.forEach(lane => {
      if (lane.isEmpty) store.toggleLaneEmpty(lane.laneNumber);
    });
  });
});
