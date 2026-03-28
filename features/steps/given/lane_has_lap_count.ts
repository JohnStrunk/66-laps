import { Given } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Given(/^Lane (\d+) (?:has a lap count of|has completed|is on Lap) (\d+)(?: laps)?(?: but touched earlier than Lane (\d+))?$/, async function (this: CustomWorld, laneNumberStr: string, countStr: string, touchedEarlierLaneStr?: string) {
  const laneNumber = parseInt(laneNumberStr, 10);
  const count = parseInt(countStr, 10);
  const touchedEarlierLane = touchedEarlierLaneStr ? parseInt(touchedEarlierLaneStr, 10) : undefined;

  await this.page!.evaluate((args) => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    const state = store.getState();
    const lanes = state.lanes.map((l) => {
      if (args.touchedEarlierLane) {
        if (l.laneNumber === args.laneNumber) return { ...l, count: args.count, history: [Date.now() - 1000] };
        if (l.laneNumber === args.touchedEarlierLane) return { ...l, count: args.count, history: [Date.now()] };
      } else {
        if (l.laneNumber === args.laneNumber) return { ...l, count: args.count };
      }
      return l;
    });
    store.setState({ lanes });
  }, { laneNumber, count, touchedEarlierLane });

  // Verify the state using the store, not the UI, for robust Given steps.
  const stateVerified = await this.page!.evaluate((args) => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    const state = store.getState();
    const lane = state.lanes.find(l => l.laneNumber === args.laneNumber);
    return lane?.count === args.count;
  }, { laneNumber, count });

  assert.strictEqual(stateVerified, true, `Failed to set lane ${laneNumber} to count ${count}`);
});
