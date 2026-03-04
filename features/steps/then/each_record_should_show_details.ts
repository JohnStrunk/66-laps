import { expect } from '@playwright/test';
import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Then('each record should show the start time, distance, lane count, event, and heat', async function (this: CustomWorld) {
  const cards = await this.page!.locator('[data-testid="history-record"]').all();
  for (const card of cards) {
    const text = await card.textContent() || '';
    expect(text, `Record should show distance, got "${text}"`).toMatch(/SC|LC/);
    expect(text, `Record should show lane count, got "${text}"`).toMatch(/Lanes/);
    expect(text, `Record should show event number, got "${text}"`).toMatch(/E \d+/);
    expect(text, `Record should show heat number, got "${text}"`).toMatch(/H \d+/);
    expect(text, `Record should show time, got "${text}"`).toMatch(/\d+:\d+/);
  }
});
