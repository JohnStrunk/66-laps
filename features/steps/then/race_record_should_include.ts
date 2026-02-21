import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Then('the race record should include event {int}, heat {int}, and length {string}', async function (this: CustomWorld, eventNum: number, heatNum: number, length: string) {
  await this.page!.waitForFunction(({ eNum, hNum, len }) => {
    const store = (window as unknown as TestWindow).__bellLapStore.getState();
    return store.eventNumber === eNum.toString() &&
           store.heatNumber === hNum.toString() &&
           store.event === len;
  }, { eNum: eventNum, hNum: heatNum, len: length });
});
