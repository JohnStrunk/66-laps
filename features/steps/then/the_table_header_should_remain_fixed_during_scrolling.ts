import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('the table header should remain fixed during scrolling', async function (this: CustomWorld) {
  const tableWrapper = this.page!.locator('.lap-oof-table-wrapper');
  const header = this.page!.locator('thead');

  const initialHeaderRect = await header.boundingBox();
  if (!initialHeaderRect) throw new Error('Could not get header bounding box');

  await tableWrapper.evaluate((el) => {
    el.scrollTop = 100;
  });

  await this.page!.waitForTimeout(100);

  const newHeaderRect = await header.boundingBox();
  if (!newHeaderRect) throw new Error('Could not get header bounding box after scroll');

  assert.ok(Math.abs(newHeaderRect.y - initialHeaderRect.y) < 2,
    `Header moved vertically: expected same as ${initialHeaderRect.y}, got ${newHeaderRect.y}`);

  const firstRow = this.page!.locator('tbody tr').first();
  await tableWrapper.evaluate((el) => {
    el.scrollTop = 0;
  });
  const rowInitialRect = await firstRow.boundingBox();

  await tableWrapper.evaluate((el) => {
    el.scrollTop = 50;
  });
  await this.page!.waitForTimeout(100);
  const rowNewRect = await firstRow.boundingBox();

  if (rowInitialRect && rowNewRect) {
     assert.notStrictEqual(rowInitialRect.y, rowNewRect.y, 'Row did not move during scroll');
  }
});
