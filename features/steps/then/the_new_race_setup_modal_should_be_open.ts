import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('the new race setup modal should be open', async function (this: CustomWorld) {
  const modal = this.page!.locator('[data-testid="new-race-setup-dialog"]');
  await modal.waitFor({ state: 'visible', timeout: 5000 });
});
