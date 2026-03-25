import { Given, DataTable } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { TestWindow, RaceRecord, LapEvent, EventType } from '../../support/store-type';

Given('I have a(n) {string} race in my history with the following events:', async function (this: CustomWorld, eventName: string, table: DataTable) {
  const data = table.hashes();

  await this.page!.evaluate(({ eventsData, event }) => {
    const store = (window as unknown as TestWindow).__bellLapStore;

    const laneEventsMap: Record<number, LapEvent[]> = {};
    (eventsData as { Lane: string; Lap: string; Timestamp: string }[]).forEach((row) => {
      const laneNum = parseInt(row.Lane);
      const lapNum = parseInt(row.Lap);
      const timestamp = parseInt(row.Timestamp);

      if (!laneEventsMap[laneNum]) {
        laneEventsMap[laneNum] = [];
      }

      laneEventsMap[laneNum].push({
        timestamp,
        type: 'touch',
        prevCount: lapNum - 2,
        newCount: lapNum
      });
    });

    const lanes = Object.keys(laneEventsMap).map(laneStr => {
      const laneNum = parseInt(laneStr);
      const evs = laneEventsMap[laneNum];
      const maxCount = Math.max(...evs.map(e => e.newCount));

      return {
        laneNumber: laneNum,
        count: maxCount,
        isEmpty: false,
        history: evs.map(e => e.timestamp),
        events: evs
      };
    });

    const record: RaceRecord = {
      id: 'test-race-id',
      startTime: 0,
      event: event as EventType,
      laneCount: 8,
      eventNumber: '1',
      heatNumber: '1',
      lanes: lanes as unknown as RaceRecord['lanes']
    };
    store.setState({ history: [record] });
  }, { eventsData: data, event: eventName });

  const historyLength = await this.page!.evaluate(() => {
    return (window as unknown as TestWindow).__bellLapStore.getState().history.length;
  });
  expect(historyLength).toBeGreaterThan(0);
});
