import { Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { expect } from '@playwright/test';

Then('I should see a {string} icon button on each race record', async function (this: CustomWorld, iconType: string) {
  const records = this.page!.getByTestId('history-record');
  const count = await records.count();
  expect(count > 0, "No history records found").toBeTruthy();

  const testId = iconType === 'share' ? 'share-history-button' : 'download-history-button';

  for (let i = 0; i < count; i++) {
    const record = records.nth(i);
    const button = record.getByTestId(testId);
    await expect(button, `${iconType} button not visible for record ${i}`).toBeVisible();
  }
});
