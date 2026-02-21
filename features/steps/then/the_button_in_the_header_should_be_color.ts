import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the {string} button in the header should be {string}', async function (this: CustomWorld, buttonName: string, color: string) {
  let selector = '';
  if (buttonName === "Exit") {
    // Try both history and race exit buttons
    const historyExit = this.page!.locator('[data-testid="exit-history-button"]');
    if (await historyExit.isVisible()) {
      selector = '[data-testid="exit-history-button"]';
    } else {
      selector = '[data-testid="exit-button"]';
    }
  } else {
    selector = `header button:has-text("${buttonName}")`;
  }

  const button = this.page!.locator(selector);
  await button.waitFor({ state: 'visible' });
  const classes = await button.getAttribute('class');

  if (color === "red") {
    // HeroUI danger color usually manifests as 'data-color="danger"' or classes containing 'danger'
    const hasDanger = classes?.includes('danger') || (await button.getAttribute('data-color')) === 'danger';
    assert.ok(hasDanger, `Button "${buttonName}" is not red (danger). Classes: ${classes}`);
  }
});
