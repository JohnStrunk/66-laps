import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the UI should respect the top safe area inset', async function (this: CustomWorld) {
  if (!this.page) throw new Error('No page found');

  const { inset, paddingTop } = await this.page.evaluate(() => {
    const header = document.querySelector('header');
    return {
      inset: getComputedStyle(document.documentElement).getPropertyValue('--simulated-safe-area-top').trim(),
      paddingTop: header ? getComputedStyle(header).paddingTop : '0px'
    };
  });

  assert.strictEqual(paddingTop, inset, `Header padding-top (${paddingTop}) does not match safe area inset (${inset})`);
});
