import { Then } from "@cucumber/cucumber";
import assert from "node:assert";
import { CustomWorld } from "../../support/world";

Then('I should see a {string} icon button on each race record', async function (this: CustomWorld, iconType: string) {
  const records = this.page!.getByTestId('history-record');
  const count = await records.count();
  assert.ok(count > 0, "No history records found");

  const testId = iconType === 'share' ? 'share-history-button' : 'download-history-button';

  for (let i = 0; i < count; i++) {
    const record = records.nth(i);
    const button = record.getByTestId(testId);
    assert.ok(await button.isVisible(), `${iconType} button not visible for record ${i}`);
  }
});
