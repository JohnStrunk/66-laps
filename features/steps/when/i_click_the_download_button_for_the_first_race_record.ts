import { When } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { waitForVisible } from "../../support/utils";

When('I click the {string} button for the first race record', async function (this: CustomWorld, iconType: string) {
  const testId = iconType === 'share' ? 'share-history-button' : 'download-history-button';
  const firstRecord = this.page!.getByTestId('history-record').first();
  await waitForVisible(firstRecord);
  const button = firstRecord.getByTestId(testId);
  await waitForVisible(button);
  await button.click({ force: true });
});
