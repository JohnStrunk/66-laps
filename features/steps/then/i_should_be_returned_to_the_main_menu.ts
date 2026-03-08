import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

Then('I should be returned to the main menu', async function (this: CustomWorld) {
  const mainMenu = this.page!.locator('text=Main menu');
  await expect(mainMenu).toBeVisible();
});
