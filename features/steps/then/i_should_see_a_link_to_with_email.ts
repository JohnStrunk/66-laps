import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

Then('I should see a link to {string} with email {string}', async function (this: CustomWorld, text: string, email: string) {
  const link = this.page!.locator(`text=${text}`);
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute('href', `mailto:${email}`);
});
