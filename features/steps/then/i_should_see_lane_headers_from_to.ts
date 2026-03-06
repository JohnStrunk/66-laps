import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('I should see lane headers from {int} to {int}', async function (this: CustomWorld, start: number, end: number) {
  for (let n = start; n <= end; n++) {
    const header = this.page!.locator(`[data-testid="lane-header-${n}"]`);
    await expect(header).toBeVisible();
    await expect(header).toHaveText(n.toString());
  }
});
