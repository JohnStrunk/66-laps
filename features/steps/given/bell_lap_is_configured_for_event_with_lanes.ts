import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';
import { EventType } from '../../../src/modules/bellLapStore';

Given('Bell Lap is configured for a {string} event with {int} lanes', async function (this: CustomWorld, eventName: string, laneCount: number) {
  await this.page!.evaluate(({ name, count }) => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    store.getState().setEvent(name as EventType);
    store.getState().setLaneCount(count);
    // Also close the initial setup dialog if it's open
    store.getState().setSetupDialogOpen(false);
  }, { name: eventName, count: laneCount });
});
