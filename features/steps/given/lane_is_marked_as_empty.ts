import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';
import assert from 'node:assert';

Given('Lane {int} is marked as "EMPTY"', async function (this: CustomWorld, laneNumber: number) {
  await this.page!.evaluate((laneNum) => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    const state = store.getState();

    // Attempt to mark it empty in the active race lanes if present
    const lanes = [...state.lanes];
    const laneIndex = lanes.findIndex((l) => l.laneNumber === laneNum);
    if (laneIndex >= 0 && !lanes[laneIndex].isEmpty) {
        state.toggleLaneEmpty(laneNum);
    }

    // Also mark it empty in the most recent history record if it exists, since this step might be used after setup
    if (state.history && state.history.length > 0) {
        const history = [...state.history];
        const lastRace = { ...history[0] };
        const lastRaceLanes = [...lastRace.lanes];
        const hLaneIndex = lastRaceLanes.findIndex(l => l.laneNumber === laneNum);
        if (hLaneIndex >= 0) {
            lastRaceLanes[hLaneIndex] = { ...lastRaceLanes[hLaneIndex], isEmpty: true };
            lastRace.lanes = lastRaceLanes;
            history[0] = lastRace;
            store.setState({ history });
        }
    }
  }, laneNumber);

  // Verify store state
  const isActuallyEmpty = await this.page!.evaluate((laneNum) => {
    const state = (window as unknown as TestWindow).__bellLapStore.getState();
    const lane = state.lanes.find((l) => l.laneNumber === laneNum);
    return lane ? lane.isEmpty : false;
  }, laneNumber);

  assert.strictEqual(isActuallyEmpty, true, `Lane ${laneNumber} failed to be marked as empty`);
});
