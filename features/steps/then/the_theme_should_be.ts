import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the theme should be {string}', async function (this: CustomWorld, expectedTheme: string) {
  const theme = await this.page!.evaluate(() => {
    return localStorage.getItem('theme');
  });
  assert.strictEqual(theme, expectedTheme, `Expected theme to be ${expectedTheme}, but got ${theme}`);
});
