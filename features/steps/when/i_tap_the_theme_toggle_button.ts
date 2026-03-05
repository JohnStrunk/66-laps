import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I tap the theme toggle button', async function (this: CustomWorld) {
  // Support both LightDark.tsx (Main Site) and BellLapHeader.tsx (PWA)
  const selectors = [
    'button[aria-label="Switch to light mode"]',
    'button[aria-label="Switch to dark mode"]',
    'button[aria-label="Toggle light/dark mode"]',
    '[data-testid="theme-toggle"]'
  ];
  const button = this.page!.locator(selectors.join(', ')).first();
  await button.click();
});
