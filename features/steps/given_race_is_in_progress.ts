import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Given('a race is in progress with non-zero counts', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    (window as any).__bellLapStore.getState().registerTouch(1, true);
  });
  await this.page!.waitForFunction(
    () => document.querySelector('[data-lane-number="1"] [data-testid="lane-count"]')?.textContent === '2'
  );
});
