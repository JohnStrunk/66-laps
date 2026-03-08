import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { EventType } from '../../../src/modules/bellLapStore';

Given('I have a {string} race with {int} lanes in my history', async function (this: CustomWorld, event: string, laneCount: number) {
  await this.page!.evaluate(({ event, laneCount }) => {
    const store = window.__bellLapStore.getState();
    const now = Date.now();

    // Create lanes
    const lanes = Array.from({ length: laneCount }, (_, i) => ({
      laneNumber: i + 1,
      count: 2,
      isEmpty: false,
      history: [now - 1000],
      events: [{
        timestamp: now - 1000,
        type: 'touch' as const,
        prevCount: 0,
        newCount: 2
      }]
    }));

    const record = {
      id: crypto.randomUUID(),
      startTime: now - 2000,
      event: event as EventType,
      laneCount,
      eventNumber: '1',
      heatNumber: '1',
      lanes
    };

    window.__bellLapStore.setState({
      history: [record, ...store.history]
    });
  }, { event, laneCount });
});
