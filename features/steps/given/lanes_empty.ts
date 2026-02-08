import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('lanes {int}, {int}, and {int} are empty', async function (this: CustomWorld, l1: number, l2: number, l3: number) {
  for (const lane of [l1, l2, l3]) {
    await this.page!.evaluate((l) => {
      const store = (window as unknown as TestWindow).__bellLapStore.getState();
      const laneObj = store.lanes.find((lo) => lo.laneNumber === l);
      if (laneObj && !laneObj.isEmpty) store.toggleLaneEmpty(l);
    }, lane);
  }
});
