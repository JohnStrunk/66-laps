import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('I am on the main menu', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    store.getState().setView('main-menu');
    store.getState().setSetupDialogOpen(false);
  });
  await this.page!.locator('[data-testid="new-race-button"]').waitFor({ state: 'visible' });
});
