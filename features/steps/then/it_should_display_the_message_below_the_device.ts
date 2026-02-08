import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('it should display the message {string} below the device', async function (this: CustomWorld, expectedMessage: string) {
  const messageEl = this.page!.locator('[data-testid="mobile-usage-message"]');
  await messageEl.waitFor({ state: 'visible' });
  const actualText = await messageEl.innerText();

  // Normalized expected message to match innerText which uses \n for newlines
  const normalizedExpected = expectedMessage.split('\\n').join('\n');

  assert.strictEqual(actualText, normalizedExpected, `Expected message "${normalizedExpected}" but got "${actualText}"`);
});
