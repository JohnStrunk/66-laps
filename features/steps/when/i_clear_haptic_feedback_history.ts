import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

interface CustomWindow extends Window {
  __VIBRATE_CALLS__: number[][];
}

When('I clear haptic feedback history', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    (window as unknown as CustomWindow).__VIBRATE_CALLS__ = [];
  });
});
