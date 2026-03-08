import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Given('I toggle the view flip setting', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    window.__bellLapStore.getState().toggleFlip();
  });
});
