import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

const testIdMap: Record<string, string> = {
  'Event Selection': 'event-selection-dropdown',
  'Lanes': 'lanes-dropdown',
  'Event Number': 'event-number-input',
  'Heat Number': 'heat-number-input'
};

Then('the {string} dropdown should have {string} selected', async function (this: CustomWorld, label: string, expectedValue: string) {
  const testId = testIdMap[label];
  const dropdown = this.page!.getByTestId(testId);
  const text = await dropdown.textContent();
  assert.ok(text?.includes(expectedValue), `Expected dropdown "${label}" to have "${expectedValue}" selected, but got "${text}"`);
});

Then('the {string} field should contain {string}', async function (this: CustomWorld, label: string, expectedValue: string) {
  const testId = testIdMap[label];
  const field = this.page!.getByTestId(testId);
  const actualValue = await field.inputValue();
  assert.strictEqual(actualValue, expectedValue, `Expected field "${label}" to contain "${expectedValue}", but got "${actualValue}"`);
});
