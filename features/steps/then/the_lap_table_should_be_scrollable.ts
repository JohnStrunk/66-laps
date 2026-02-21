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

Then('the table header should remain fixed during scrolling', async function (this: CustomWorld) {
  const tableWrapper = this.page!.locator('.lap-oof-table-wrapper');
  const header = this.page!.locator('thead');

  // Initial position of the header
  const initialHeaderRect = await header.boundingBox();
  if (!initialHeaderRect) throw new Error('Could not get header bounding box');

  // Scroll down
  await tableWrapper.evaluate((el) => {
    el.scrollTop = 100;
  });

  // Wait a bit for any layout shifts
  await this.page!.waitForTimeout(100);

  // New position of the header
  const newHeaderRect = await header.boundingBox();
  if (!newHeaderRect) throw new Error('Could not get header bounding box after scroll');

  // Header should stay at the same Y position relative to the viewport (or its container)
  // Since we are checking sticky header, its position relative to the viewport should be fixed
  // if it's sticky within a container that is not scrolled itself.
  // Actually, the wrapper is scrolling, the header is sticky INSIDE the wrapper.
  // The header's `y` position relative to the viewport should stay the same.

  assert.ok(Math.abs(newHeaderRect.y - initialHeaderRect.y) < 2,
    `Header moved vertically: expected same as ${initialHeaderRect.y}, got ${newHeaderRect.y}`);

  // Also verify that some data actually moved
  const firstRow = this.page!.locator('tbody tr').first();
  const firstRowRect = await firstRow.boundingBox();
  if (!firstRowRect) throw new Error('Could not get first row bounding box');

  // Since we scrolled down 100px, the first row should have moved UP
  // (its y should be smaller or it might be clipped/hidden)
  // Wait, if we scroll el.scrollTop = 100, the content moves up.

  // Let's just compare row position before and after scroll
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
