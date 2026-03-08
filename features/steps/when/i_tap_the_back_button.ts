import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I tap the back button', async function (this: CustomWorld) {
  await this.page!.locator('[data-testid="exit-help-button"]').click();
});
