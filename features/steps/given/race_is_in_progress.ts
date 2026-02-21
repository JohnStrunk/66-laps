import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('a race is in progress', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    // We don't want to actually register a touch here unless we have to,
    // but we need the app to not be on the main menu.
    // Assuming for now that any race state in store makes it NOT the main menu.
    store.getState().setSetupDialogOpen(false);
  });
});
