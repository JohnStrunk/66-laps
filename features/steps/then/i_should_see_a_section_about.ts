import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

Then('I should see a section about {string}', async function (this: CustomWorld, sectionName: string) {
  const sectionHeader = this.page!.locator('h2', { hasText: sectionName });
  await expect(sectionHeader).toBeVisible();
});
