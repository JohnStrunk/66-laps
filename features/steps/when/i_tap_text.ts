import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I tap {string}', async function (this: CustomWorld, buttonText: string) {
  await this.page!.click(`button:has-text("${buttonText}")`);
});
