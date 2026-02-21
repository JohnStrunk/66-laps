import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('the lap table should not have horizontal scrolling', async function (this: CustomWorld) {
  const tableWrapper = this.page!.locator('.lap-oof-table-wrapper');
  await tableWrapper.waitFor({ state: 'visible' });

  const result = await tableWrapper.evaluate((el) => {
    return {
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      hasHorizontalScroll: el.scrollWidth > el.clientWidth + 1 // 1px tolerance
    };
  });

  assert.strictEqual(result.hasHorizontalScroll, false, `The lap table has horizontal scrolling (scrollWidth: ${result.scrollWidth}, clientWidth: ${result.clientWidth})`);
});
