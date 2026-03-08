import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the most recent race in history should have a start time equal to the first touch timestamp', async function (this: CustomWorld) {
  const result = await this.page!.evaluate(() => {
    const store = window.__bellLapStore.getState();
    const history = store.history;
    if (history.length === 0) return { error: 'No history' };

    const latestRace = history[0];
    // Find the first event timestamp across all lanes
    let firstEventTime = Infinity;
    latestRace.lanes.forEach(lane => {
      if (lane.events.length > 0) {
        const t = lane.events[0].timestamp;
        if (t < firstEventTime) firstEventTime = t;
      }
    });

    return {
      startTime: latestRace.startTime,
      firstEventTime: firstEventTime === Infinity ? null : firstEventTime
    };
  });

  if ('error' in result) throw new Error(result.error);

  expect(result.firstEventTime).not.toBeNull();
  expect(result.startTime).toBe(result.firstEventTime);
});
