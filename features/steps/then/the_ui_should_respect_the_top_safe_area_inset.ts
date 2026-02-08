import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the UI should respect the top safe area inset', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');

  const { inset, paddingTop } = await this.page.evaluate(() => {
    const header = document.querySelector('[data-testid="bell-lap-header"]');
    return {
      inset: getComputedStyle(document.documentElement).getPropertyValue('--simulated-safe-area-top').trim(),
      paddingTop: header ? getComputedStyle(header).paddingTop : '0px'
    };
  });

  // Convert inset (e.g. "20px") to number, add 8px (0.5rem), and compare.
  const insetVal = parseInt(inset.replace('px', ''), 10);
  const expectedPadding = `${insetVal + 8}px`;

  assert.strictEqual(paddingTop, expectedPadding, `Header padding-top (${paddingTop}) does not match expected padding (${expectedPadding}) derived from safe area inset (${inset})`);
});
