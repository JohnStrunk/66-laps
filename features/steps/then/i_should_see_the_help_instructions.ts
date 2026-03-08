import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

Then('I should see the help instructions', async function (this: CustomWorld) {
  const helpView = this.page!.locator('[data-testid="help-view"]');
  await expect(helpView).toBeVisible();
});
