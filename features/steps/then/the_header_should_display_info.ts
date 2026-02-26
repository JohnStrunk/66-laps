import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('the header should display {string}', async function (this: CustomWorld, text: string) {
  const header = this.page!.getByTestId('bell-lap-header');
  const headerText = await header.textContent();

  // Handle "Event X" vs "E X" and "Heat Y" vs "H Y"
  let match = headerText?.includes(text);
  if (!match) {
    if (text.startsWith('Event ')) {
      match = headerText?.includes('E ' + text.substring(6));
    } else if (text.startsWith('Heat ')) {
      match = headerText?.includes('H ' + text.substring(5));
    }
  }

  assert.ok(match, `Expected header to display "${text}", but got "${headerText}"`);
});

Then('the header should not display {string}', async function (this: CustomWorld, text: string) {
  const header = this.page!.getByTestId('bell-lap-header');
  const headerText = await header.textContent();

  let match = headerText?.includes(text);
  if (!match) {
    if (text === 'Event') {
       match = headerText?.includes('E ');
    } else if (text === 'Heat') {
       match = headerText?.includes('H ');
    }
  }

  assert.ok(!match, `Expected header NOT to display "${text}", but it did. Header text: "${headerText}"`);
});
