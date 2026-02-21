import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow, RaceRecord } from '../../support/store-type';

Given('I have 50 races in my history', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    const history: RaceRecord[] = Array.from({ length: 50 }, (_, i) => ({
      id: `history-${i}`,
      startTime: Date.now() - (i * 1000), // Ensures chronological order (newest first)
      event: '500 SC',
      laneCount: 8,
      eventNumber: `${i}`,
      heatNumber: '1',
      lanes: []
    }));
    store.setState({ history });
    const state = store.getState();
    const persistedState = {
        state: {
            ...state,
            history
        },
        version: 0
    };
    localStorage.setItem('bell-lap-storage', JSON.stringify(persistedState));
  });
});
