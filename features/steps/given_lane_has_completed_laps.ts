import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Given('Lane {int} has completed {int} laps', async function (this: CustomWorld, lane: number, laps: number) {
  await this.page!.evaluate((args) => {
    (window as any).__bellLapStore.getState().updateLaneCount(args.lane, args.laps);
  }, { lane, laps });
});
