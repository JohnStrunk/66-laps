import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { BASE_URL } from '../../support/utils';
import { TestWindow } from '../../support/store-type';

Given('Bell Lap is configured for a/an {int}-lane event', async function (this: CustomWorld, laneCount: number) {
  await this.page!.goto(`${BASE_URL}/app?lanes=${laneCount}&testMode=true`);
  await this.page!.waitForSelector('[data-mounted="true"]');

  // Ensure view is race and setup dialog is closed
  await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    if (store) {
      store.getState().setView('race');
      store.getState().setSetupDialogOpen(false);
    }
  });

  await this.page!.waitForSelector('[data-testid="lane-row"]');
});
