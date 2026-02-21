import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

When('I complete a new race', async function (this: CustomWorld) {
  // Start a new race
  await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    store.getState().setView('race');
    // Add some data
    store.getState().registerTouch(1, true);
    // Exit
    store.getState().exitRace();
  });
});
