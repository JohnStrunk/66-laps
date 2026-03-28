import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';

When('I enter {string} in the Heat Number field', async function (this: CustomWorld, value: string) {
  const input = this.page!.locator('[data-testid="heat-number-input"], [data-testid="settings-Heat Number"]');
  await input.first().fill(value);

  // Update state directly under mock clock
  await this.page!.evaluate((val) => {
      const store = (window as unknown as import('../../support/store-type').TestWindow).__bellLapStore;
      if (store) {
          store.getState().setHeatNumber(val);
      }
  }, value);
  await advanceClock(this.page!, 200);
});
