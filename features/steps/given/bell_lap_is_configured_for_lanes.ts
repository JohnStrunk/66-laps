import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { BASE_URL } from '../../support/utils';
import { TestWindow } from '../../support/store-type';

Given('Bell Lap is configured for a/an {int}-lane event', async function (this: CustomWorld, laneCount: number) {
  // Rather than fully reloading the page to set lanes (which takes 2-3s), we can just set state directly if already mounted.
  // Check if we are already on the app page
  const currentUrl = this.page!.url();
  if (!currentUrl.includes('/app')) {
    await this.page!.goto(`${BASE_URL}/app?testMode=true`);
    await this.page!.waitForSelector('[data-mounted="true"]');
  }

  // Ensure view is race and setup dialog is closed, and set lanes directly
  await this.page!.evaluate((lanes) => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    if (store) {
      store.getState().setLaneCount(lanes);
      store.getState().setView('race');
      store.getState().setSetupDialogOpen(false);
    }
  }, laneCount);

  await this.page!.waitForSelector('[data-testid="lane-row"]');
});
