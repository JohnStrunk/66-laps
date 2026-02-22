import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('for lap {int}, the order of finish should be {string}', async function (this: CustomWorld, lapNum: number, expectedOrder: string) {
  // Find the row with the lap number
  const row = this.page!.locator('tr').filter({ hasText: lapNum.toString() });
  const cells = row.locator('td');

  // The second cell should contain the lane numbers in order
  const orderCell = cells.nth(1);
  const actualText = await orderCell.textContent();

  // Clean up actualText: remove whitespace and the pipe separator
  const cleanedActual = actualText?.replace(/\s+/g, '').split('|').join(',').replace(/,$/, '') || '';
  const cleanedExpected = expectedOrder.replace(/\s+/g, '');

  assert.strictEqual(cleanedActual, cleanedExpected);
});
