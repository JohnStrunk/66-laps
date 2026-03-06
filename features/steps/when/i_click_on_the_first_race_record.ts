import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

When('I click on the first race record', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    const state = store.getState();
    if (state.history.length > 0) {
      store.getState().setSelectedRaceId(state.history[0].id);
      store.getState().setView('race-details');
    }
  });
});
