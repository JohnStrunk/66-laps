import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

Then('the new race setup modal should be open', async function (this: CustomWorld) {
  const modal = this.page!.locator('[data-testid="new-race-setup-dialog"]');
  await waitForVisible(modal);
});
