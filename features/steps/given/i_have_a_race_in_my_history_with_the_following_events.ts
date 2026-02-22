import { Given, DataTable } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow, RaceRecord, LapEvent, EventType } from '../../support/store-type';

Given('I have a(n) {string} race in my history with the following events:', async function (this: CustomWorld, eventName: string, table: DataTable) {
  const data = table.hashes();

  await this.page!.evaluate(({ eventsData, event }) => {
    const store = (window as unknown as TestWindow).__bellLapStore;

    // Group events by lane
    const laneEventsMap: Record<number, LapEvent[]> = {};
    (eventsData as { Lane: string; Lap: string; Timestamp: string }[]).forEach((row) => {
      const laneNum = parseInt(row.Lane);
      const lapNum = parseInt(row.Lap);
      const timestamp = parseInt(row.Timestamp);

      if (!laneEventsMap[laneNum]) {
        laneEventsMap[laneNum] = [];
      }

      // We simulate a touch event
      laneEventsMap[laneNum].push({
        timestamp,
        type: 'touch',
        prevCount: lapNum - 2, // simplified
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
});

// Alias for when the event is not specified (defaulting to 500 SC)
Given('I have a race in my history with the following events:', async function (this: CustomWorld, table: DataTable) {
  const data = table.hashes();

  await this.page!.evaluate(({ eventsData }) => {
    const store = (window as unknown as TestWindow).__bellLapStore;

    // Group events by lane
    const laneEventsMap: Record<number, LapEvent[]> = {};
    (eventsData as { Lane: string; Lap: string; Timestamp: string }[]).forEach((row) => {
      const laneNum = parseInt(row.Lane);
      const lapNum = parseInt(row.Lap);
      const timestamp = parseInt(row.Timestamp);

      if (!laneEventsMap[laneNum]) {
        laneEventsMap[laneNum] = [];
      }

      // We simulate a touch event
      laneEventsMap[laneNum].push({
        timestamp,
        type: 'touch',
        prevCount: lapNum - 2, // simplified
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
      event: '500 SC',
      laneCount: 8,
      eventNumber: '1',
      heatNumber: '1',
      lanes: lanes as unknown as RaceRecord['lanes']
    };
    store.setState({ history: [record] });
  }, { eventsData: data });
});
