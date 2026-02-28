import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given('I have several completed races in my history', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    const history = [
      {
        id: 'race-1',
        startTime: Date.now() - 1000 * 60 * 60, // 1 hour ago
        event: '500 SC' as const,
        laneCount: 8,
        eventNumber: '1',
        heatNumber: '1',
        lanes: []
      },
      {
        id: 'race-2',
        startTime: Date.now() - 1000 * 60 * 120, // 2 hours ago
        event: '1000 SC' as const,
        laneCount: 6,
        eventNumber: '2',
        heatNumber: '1',
        lanes: []
      },
      {
        id: 'race-3',
        startTime: Date.now() - 1000 * 60 * 180, // 3 hours ago
        event: '1650 SC' as const,
        laneCount: 10,
        eventNumber: '3',
        heatNumber: '2',
        lanes: []
      }
    ];
    store.setState({ history });

    // Update localStorage to ensure persistence
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
