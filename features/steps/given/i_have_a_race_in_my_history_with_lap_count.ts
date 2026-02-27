import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow, RaceRecord, LapEvent } from '../../support/store-type';

Given('I have a race in my history with {string} laps', async function (this: CustomWorld, lapCount: string) {
  const count = parseInt(lapCount, 10);
  await this.page!.evaluate((laps) => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    const now = Date.now();
    const startTime = now - 600000;

    const events: LapEvent[] = [];
    const timestamps: number[] = [];
    for (let i = 1; i <= laps / 2; i++) {
        const ts = startTime + i * 10000;
        timestamps.push(ts);
        events.push({
            timestamp: ts,
            type: 'touch',
            prevCount: (i - 1) * 2,
            newCount: i * 2
        });
    }

    const history: RaceRecord[] = [
      {
        id: 'many-laps',
        startTime: startTime,
        event: '1650 SC',
        laneCount: 8,
        eventNumber: '66',
        heatNumber: '1',
        lanes: [
          {
            laneNumber: 1,
            count: laps,
            isEmpty: false,
            history: timestamps,
            events: events
          }
        ]
      }
    ];
    store.setState({ history });
    const state = store.getState();
    const persistedState = {
        state: { ...state, history },
        version: 0
    };
    localStorage.setItem('bell-lap-storage', JSON.stringify(persistedState));
  }, count);
});
