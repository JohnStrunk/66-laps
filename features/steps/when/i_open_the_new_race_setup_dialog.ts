import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I open the New Race Setup dialog', async function (this: CustomWorld) {
  await this.page!.click('button[aria-label="Reset"]');
});
