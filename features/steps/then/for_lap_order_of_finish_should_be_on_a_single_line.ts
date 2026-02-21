import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('for lap {int}, the order of finish should be on a single line without wrapping', async function (this: CustomWorld, lapNum: number) {
  const row = this.page!.locator('tr').filter({ hasText: lapNum.toString() });
  const cells = row.locator('td');
  const orderCell = cells.nth(1);

  const result = await orderCell.evaluate((cell) => {
    const container = cell.querySelector('.flex');
    if (!container) return { error: 'Flex container not found' };

    const children = Array.from(container.children);
    if (children.length === 0) return { error: 'No children found in flex container' };

    const firstChildRect = children[0].getBoundingClientRect();
    const lastChildRect = children[children.length - 1].getBoundingClientRect();

    // If wrapping occurred, the last child will be below the first child
    const isWrapped = lastChildRect.top > firstChildRect.top + 5; // 5px tolerance

    // Check for horizontal overflow
    const hasHorizontalOverflow = container.scrollWidth > container.clientWidth + 1; // 1px tolerance

    return {
      isWrapped,
      hasHorizontalOverflow,
      scrollWidth: container.scrollWidth,
      clientWidth: container.clientWidth
    };
  });

  if ('error' in result) {
    throw new Error(result.error);
  }

  assert.strictEqual(result.isWrapped, false, 'The order of finish is wrapping to multiple lines');
  assert.strictEqual(result.hasHorizontalOverflow, false, `The order of finish has horizontal overflow: ${result.scrollWidth} > ${result.clientWidth}`);
});
