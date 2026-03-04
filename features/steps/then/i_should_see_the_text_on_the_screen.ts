import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('I should see the text {string} on the screen', async function (this: CustomWorld, text: string) {
  const isVisible = await this.page!.locator(`text="${text}"`).first().isVisible();
  expect(isVisible, `Expected to see text "${text}" on the screen`).toBeTruthy();
});
