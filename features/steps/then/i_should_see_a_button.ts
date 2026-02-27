import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

const testIdMap: Record<string, string> = {
  'Start Race': 'start-race-button'
};

Then(/^I should see a(?:n)? "([^"]*)" button$/, async function (this: CustomWorld, label: string) {
  const testId = testIdMap[label];
  const el = this.page!.getByTestId(testId);
  await el.waitFor({ state: 'visible' });
  assert.ok(await el.isVisible());
});
