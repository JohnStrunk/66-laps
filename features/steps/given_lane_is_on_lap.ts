import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';
import { TestWindow } from '../support/store-type';

Given('Lane {int} is on Lap {int}', async function (this: CustomWorld, lane: number, lap: number) {
  await this.page!.evaluate((args) => {
    const store = (window as unknown as TestWindow).__bellLapStore.getState();
    store.updateLaneCount(args.lane, args.lap);
  }, { lane, lap });
});
