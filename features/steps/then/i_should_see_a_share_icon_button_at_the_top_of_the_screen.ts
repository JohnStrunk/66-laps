import { Then } from "@cucumber/cucumber";
import assert from "node:assert";
import { CustomWorld } from "../../support/world";

Then('I should see a {string} icon button at the top of the screen', async function (this: CustomWorld, iconType: string) {
  const testId = iconType === 'share' ? 'share-history-button' : 'download-history-button';
  const header = this.page!.getByTestId('bell-lap-header');
  const button = header.getByTestId(testId);
  assert.ok(await button.isVisible(), `${iconType} button not visible in header`);
});
