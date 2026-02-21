import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Then('lane {int} history should contain a {string} event from {int} to {int}', async function (this: CustomWorld, laneNumber: number, eventType: string, prevCount: number, newCount: number) {
  await this.page!.waitForFunction(({ laneNum, type, prev, next }) => {
    const store = (window as unknown as TestWindow).__bellLapStore.getState();
    const lane = store.lanes.find((l) => l.laneNumber === laneNum);
    if (!lane) return false;
    // Map human readable event names if needed
    if (type === 'manual_adjustment') {
        return lane.events.some((e) =>
            (e.type === 'manual_increment' || e.type === 'manual_decrement') &&
            e.prevCount === prev &&
            e.newCount === next &&
            typeof e.timestamp === 'number' && e.timestamp > 0
        );
    }
    return lane.events.some((e) =>
        e.type === type &&
        e.prevCount === prev &&
        e.newCount === next &&
        typeof e.timestamp === 'number' && e.timestamp > 0
    );
  }, { laneNum: laneNumber, type: eventType, prev: prevCount, next: newCount });
});
