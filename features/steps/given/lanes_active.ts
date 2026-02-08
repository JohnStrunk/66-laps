import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('lanes {int}, {int}, and {int} are active', async function (this: CustomWorld, l1: number, l2: number, l3: number) {
  await this.page!.evaluate((args) => {
    const store = (window as unknown as TestWindow).__bellLapStore.getState();
    [args.l1, args.l2, args.l3].forEach(laneNum => {
      const lane = store.lanes.find((l) => l.laneNumber === laneNum);
      if (lane?.isEmpty) store.toggleLaneEmpty(laneNum);
    });
  }, { l1, l2, l3 });
});
