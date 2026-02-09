import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then('the theme should be {string}', async function (this: CustomWorld, expectedTheme: string) {
  // If it's system, we don't necessarily know if it's light or dark without more info,
  // but we can check what the app thinks it is.

  await this.page!.waitForFunction(
    (expected) => {
      const html = document.documentElement;
      if (expected === 'dark') return html.classList.contains('dark');
      if (expected === 'light') return html.classList.contains('light') || (!html.classList.contains('dark'));
      return true; // for system we just pass or could check more
    },
    expectedTheme,
    { timeout: 5000 }
  );

  const theme = await this.page!.evaluate(() => {
    return localStorage.getItem('theme');
  });
  assert.strictEqual(theme, expectedTheme, `Expected theme to be ${expectedTheme}, but got ${theme}`);
});
