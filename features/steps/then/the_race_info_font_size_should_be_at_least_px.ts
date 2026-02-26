import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('the race info font size should be at least {int}px', async function (this: CustomWorld, minSize: number) {
  // Check both history record info and header race info if they exist
  const historyInfo = this.page!.locator('[data-testid="history-record-info"]').first();
  const headerInfo = this.page!.locator('[data-testid="header-race-info"]');

  let target = historyInfo;
  if (!(await historyInfo.isVisible())) {
    target = headerInfo;
  }

  await target.waitFor({ state: 'visible' });
  const fontSize = await target.evaluate((el) => window.getComputedStyle(el).fontSize);
  const size = parseInt(fontSize);

  assert.ok(size >= minSize, `Expected font size to be at least ${minSize}px, but got ${fontSize}`);
});
