import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

When('I tap the {string} button in Zone A for Lane {int}', async function (this: CustomWorld, button: string, laneNumber: number) {
  const action = button === '+' ? 'Increment' : 'Decrement';
  const btn = this.page!.locator(`button[aria-label="${action} lane ${laneNumber}"]`);
  await btn.click();
});
