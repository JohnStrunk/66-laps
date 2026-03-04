import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the {string} button in Zone A for Lane {int} should be disabled', async function (this: CustomWorld, button: string, laneNumber: number) {
  const type = button === '+' ? 'increment' : 'decrement';
  const btn = this.page!.locator(`[data-testid="${type}-button-lane-${laneNumber}"]`);

  // Wait for the button and check its disabled state
  await btn.waitFor({ state: 'attached' });
  const dataDisabled = await btn.getAttribute('data-disabled');
  expect(dataDisabled, `Button ${button} for Lane ${laneNumber} should be disabled`).toBe('true');
});
