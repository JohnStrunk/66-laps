import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I click on the first race record', async function (this: CustomWorld) {
  const records = await this.page!.$$('[data-testid="history-record"]');
  if (records.length === 0) {
    throw new Error('No history records found');
  }
  await records[0].click();
});
