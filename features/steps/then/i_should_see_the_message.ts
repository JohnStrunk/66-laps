import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('I should see the {string} message', async function (this: CustomWorld, message: string) {
  const element = this.page!.getByText(message);
  await expect(element).toBeVisible();
  await expect(element).toBeVisible();
});
