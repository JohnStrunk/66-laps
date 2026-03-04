import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('I should see a time label for {string}', async function (this: CustomWorld, time: string) {
  const label = this.page!.locator(`[data-testid="time-label-${time}"]`);
  expect(await label.isVisible(), `Time label ${time} should be visible`).toBeTruthy();
  expect(await label.textContent()).toBe(time);
});
