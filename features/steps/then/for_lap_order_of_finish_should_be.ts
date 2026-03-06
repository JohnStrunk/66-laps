import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('for lap {int}, the order of finish should be {string}', async function (this: CustomWorld, lapNum: number, expectedOrder: string) {
  // Find the row with the lap number
  // Be specific so we don't accidentally match another row
  const row = this.page!.locator('tr', { has: this.page!.locator('td').nth(0).filter({ hasText: new RegExp(`^\\s*${lapNum}\\s*$`) }) }).first();
  const cells = row.locator('td');

  const orderCell = cells.nth(1);

  const cleanedExpected = expectedOrder.replace(/\s+/g, '');

  await expect.poll(async () => {
      const actualText = await orderCell.textContent();
      const cleanedActual = actualText?.replace(/\s+/g, '').split('|').join(',').replace(/,$/, '') || '';
      return cleanedActual === cleanedExpected;
  }, { timeout: 5000 }).toBe(true);
});
