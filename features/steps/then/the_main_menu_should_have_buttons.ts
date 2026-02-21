import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import assert from 'node:assert';

Then('the main menu should have "New Race" and "History" buttons', async function (this: CustomWorld) {
  const newRace = this.page!.locator('[data-testid="new-race-button"]');
  const history = this.page!.locator('[data-testid="history-button"]');

  await newRace.waitFor({ state: 'visible' });
  await history.waitFor({ state: 'visible' });
});
