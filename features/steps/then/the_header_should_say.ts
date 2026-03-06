import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the header should say {string}', async function (this: CustomWorld, text: string) {
  const header = this.page!.locator('[data-testid="bell-lap-header"]');
  await expect(header).toContainText(text);
});
