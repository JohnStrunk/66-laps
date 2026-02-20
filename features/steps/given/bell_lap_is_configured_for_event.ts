import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';
import { EventType } from '../../../src/modules/bellLapStore';

Given('Bell Lap is configured for a {string} event', async function (this: CustomWorld, eventName: string) {
  await this.page!.evaluate((name) => {
    (window as unknown as TestWindow).__bellLapStore.getState().setEvent(name as EventType);
  }, eventName);
});
