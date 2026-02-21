import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow, RaceRecord } from '../../support/store-type';

Given('I have completed several races', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    const history: RaceRecord[] = [
      {
        id: '1',
        startTime: Date.now() - 100000,
        event: '500 SC',
        laneCount: 8,
        eventNumber: '1',
        heatNumber: '1',
        lanes: []
      },
      {
        id: '2',
        startTime: Date.now() - 200000,
        event: '1000 SC',
        laneCount: 6,
        eventNumber: '2',
        heatNumber: '1',
        lanes: []
      }
    ];
    store.setState({ history });
    // Also update localStorage to prevent hydration overwrite if any
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
