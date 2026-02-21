import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('a race is in progress with non-zero counts', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    store.getState().setSetupDialogOpen(false);
    store.getState().registerTouch(1, true);
  });
  await this.page!.waitForFunction(
    () => document.querySelector('[data-lane-number="1"] [data-testid="lane-count"]')?.textContent === '2'
  );
});
