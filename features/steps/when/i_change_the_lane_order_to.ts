import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I change the lane order to {string}', async function (this: CustomWorld, order: string) {
  // Open the dropdown
  await this.page!.click('button[aria-label="Lane Order"]');

  // Select the option
  const key = order === "1 - 8" || order === "1 - 6" || order === "1 - 10" ? 'top-to-bottom' : 'bottom-to-top';
  await this.page!.click(`[data-key="${key}"]`);
});
