import assert from 'node:assert';
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

  const lanesState = await this.page!.evaluate((args) => {
    const store = (window as unknown as TestWindow).__bellLapStore.getState();
    return [args.l1, args.l2, args.l3].every(laneNum => {
        const lane = store.lanes.find((l) => l.laneNumber === laneNum);
        return lane && lane.isEmpty;
    });
  }, { l1, l2, l3 });

  assert.ok(lanesState, 'Not all specified lanes were set to empty');
});
