import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';

Then('the header should display {string}', async function (this: CustomWorld, expectedText: string) {
  const page = this.page!;
  // Target specifically the PWA header
  const header = page.locator('[data-testid="bell-lap-header"]');

  // Header might take a moment to update due to state changes
  let found = false;
  for (let i = 0; i < 20; i++) {
    const text = await header.innerText();

    // If we're looking for an event like "500 SC", ensure we don't match "1500 SC"
    if (text === expectedText ||
        text.startsWith(`${expectedText}\n`) ||
        text.includes(`\n${expectedText}\n`) ||
        text.endsWith(`\n${expectedText}`) ||
        text.includes(` ${expectedText} `)) {
      found = true;
      break;
    }
    await advanceClock(page, 100);
    await page.waitForTimeout(10);
  }

  if (!found) {
    const actualText = await header.innerText();
    throw new Error(`Expected header to display "${expectedText}", but it displayed "${actualText}"`);
  }
});
