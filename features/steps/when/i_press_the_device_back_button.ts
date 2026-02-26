import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I press the device back button', async function (this: CustomWorld) {
  await this.page!.evaluate(() => {
    window.history.back();
  });
  // Wait a bit for the popstate event and state update
  await this.page!.waitForTimeout(200);
});
