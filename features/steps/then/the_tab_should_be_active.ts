import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('the {string} tab should be active', async function (this: CustomWorld, tabTitle: string) {
  // HeroUI Tabs use aria-selected
  const tab = this.page!.locator(`[role="tab"]:has-text("${tabTitle}")`);
  const ariaSelected = await tab.getAttribute('aria-selected');
  assert.strictEqual(ariaSelected, 'true');
});
