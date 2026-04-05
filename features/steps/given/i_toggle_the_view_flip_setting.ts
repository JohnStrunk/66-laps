import assert from 'node:assert';
import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Given('I toggle the view flip setting', async function (this: CustomWorld) {
  const prevFlip = await this.page!.evaluate(() => {
    return window.__bellLapStore.getState().isFlipped;
  });

  await this.page!.evaluate(() => {
    window.__bellLapStore.getState().toggleFlip();
  });

  const newFlip = await this.page!.evaluate(() => {
    return window.__bellLapStore.getState().isFlipped;
  });


  assert.notStrictEqual(newFlip, prevFlip);
});
