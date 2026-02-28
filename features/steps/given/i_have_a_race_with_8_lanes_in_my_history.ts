import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow, RaceRecord } from '../../support/store-type';

Given('I have a race with 8 lanes in my history', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    const history: RaceRecord[] = [
      {
        id: 'race-1',
        startTime: Date.now() - 300000,
        event: '500 SC',
        laneCount: 8,
        eventNumber: '1',
        heatNumber: '1',
        lanes: Array.from({ length: 8 }, (_, i) => ({
          laneNumber: i + 1,
          count: 2,
          isEmpty: false,
          history: [Date.now() - 280000],
          events: [
            {
              timestamp: Date.now() - 280000,
              type: 'touch',
              prevCount: 0,
              newCount: 2
            }
          ]
        }))
      }
    ];
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
