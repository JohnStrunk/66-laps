import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('each record should show the start time, distance, lane count, event, and heat', async function (this: CustomWorld) {
  const cards = await this.page!.locator('[data-testid="history-record"]').all();
  for (const card of cards) {
    const text = await card.textContent() || '';
    assert.match(text, /SC|LC/, `Record should show distance, got "${text}"`);
    assert.match(text, /Lanes/, `Record should show lane count, got "${text}"`);
    assert.match(text, /Ev/, `Record should show event number, got "${text}"`);
    assert.match(text, /Ht/, `Record should show heat number, got "${text}"`);
    assert.match(text, /\d+:\d+/, `Record should show time, got "${text}"`);
  }
});
