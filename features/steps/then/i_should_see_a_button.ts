import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';
import assert from 'node:assert';

const testIdMap: Record<string, string> = {
  'Start Race': 'start-race-button',
  'History': 'history-button',
  'New Race': 'new-race-button'
};

Then(/^I should see a(?:n)? "([^"]*)" button$/, async function (this: CustomWorld, label: string) {
  const testId = testIdMap[label];
  const el = testId ? this.page!.getByTestId(testId) : this.page!.locator(`button:has-text("${label}")`);
  await waitForVisible(el);
  assert.ok(await el.isVisible());
});
