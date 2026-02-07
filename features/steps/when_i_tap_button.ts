import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

When('I tap the {string} button', async function (this: CustomWorld, buttonName: string) {
  if (buttonName === "New Race") {
    await this.page!.click('button[aria-label="New Race"]');
  } else {
    await this.page!.click(`button:has-text("${buttonName}")`);
  }
});
