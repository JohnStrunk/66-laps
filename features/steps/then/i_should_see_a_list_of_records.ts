import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('I should see a list of records', async function (this: CustomWorld) {
  const cards = this.page!.locator('[data-testid="history-record"]');
  await cards.first().waitFor({ state: 'visible', timeout: 5000 });
  const count = await cards.count();
  assert.ok(count > 0, `Expected some records, found ${count}`);
});
