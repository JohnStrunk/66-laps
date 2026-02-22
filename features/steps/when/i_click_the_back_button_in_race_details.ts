import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I click the back button in race details', async function (this: CustomWorld) {
  await this.page!.locator('[data-testid="back-to-history-button"]').click();
});
