import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I tap the Zone B area for Lane {int}', async function (this: CustomWorld, laneNumber: number) {
  await this.page!.evaluate((l) => {
    window.__bellLapStore.getState().registerTouch(l, true);
  }, laneNumber);
});
