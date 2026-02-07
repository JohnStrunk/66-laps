import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Given('the confirmation modal is open', async function (this: CustomWorld) {
  const modal = this.page!.locator('header:has-text("Start New Race?")');
  if (!(await modal.isVisible())) {
    await this.page!.click('button[aria-label="New Race"]');
  }
  await modal.waitFor({ state: 'visible' });
});
