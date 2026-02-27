import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('the lap table should be vertically scrollable', async function (this: CustomWorld) {
  // Find the scrollable container specifically for the table using our custom class
  const tableWrapper = this.page!.locator('.lap-oof-table-wrapper');
  await tableWrapper.waitFor({ state: 'visible' });

  const isScrollable = await tableWrapper.evaluate((el) => {
    return el.scrollHeight > el.clientHeight;
  });

  assert.strictEqual(isScrollable, true, 'The lap table is not vertically scrollable');
});
