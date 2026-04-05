import assert from 'node:assert';
import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('I have no races in my history', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    store.setState({ history: [] });
    const state = store.getState();
    const persistedState = {
        state: {
            ...state,
            history: []
        },
        version: 0
    };
    localStorage.setItem('bell-lap-storage', JSON.stringify(persistedState));
  });

  const historyLength = await this.page!.evaluate(() => {
    return (window as unknown as TestWindow).__bellLapStore.getState().history.length;
  });


  assert.strictEqual(historyLength, 0);
});
