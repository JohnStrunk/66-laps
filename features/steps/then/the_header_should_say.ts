import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the header should say {string}', async function (this: CustomWorld, text: string) {
  const header = this.page!.locator('[data-testid="bell-lap-header"]');
  const content = await header.textContent();
  expect(content?.includes(text), `Header should contain "${text}", found "${content}"`).toBeTruthy();
});
