import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';
import assert from 'node:assert';

const testIdMap: Record<string, string> = {
  'Event Selection': 'event-selection-dropdown',
  'Lanes': 'lanes-dropdown'
};

Then(/^I should see a(?:n)? "([^"]*)" dropdown$/, async function (this: CustomWorld, label: string) {
  const testId = testIdMap[label];
  const el = this.page!.getByTestId(testId);
  await waitForVisible(el);
  assert.ok(await el.isVisible());
});
