import { Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { expect } from '@playwright/test';

Then('I should see a {string} icon button at the top of the screen', async function (this: CustomWorld, iconType: string) {
  const testId = iconType === 'share' ? 'share-history-button' : 'download-history-button';
  const header = this.page!.getByTestId('bell-lap-header');
  const button = header.getByTestId(testId);
  await expect(button, `${iconType} button not visible in header`).toBeVisible();
});
