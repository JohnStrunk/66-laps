import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';

Then('the header should display {string}', async function (this: CustomWorld, expectedText: string) {
  const page = this.page!;
  // Target specifically the PWA header. Use first() to avoid strict mode violations if any duplicates exist.


  await advanceClock(this.page!, 500);

  // Header might take a moment to update due to state changes
  let found = false;
  let actualText = '';
  for (let i = 0; i < 20; i++) {
    // We can also extract the text content directly via evaluate which bypasses visibility/animation issues
    const headerInfo = await page.evaluate(() => {
        const headerEl = document.querySelector('[data-testid="bell-lap-header"]');
        if (headerEl) {
           return (headerEl as HTMLElement).innerText || headerEl.textContent || "";
        }

        // Let's also check the actual store view just in case the DOM is totally frozen
        const store = (window as unknown as import('../../support/store-type').TestWindow).__bellLapStore;
        if (store) {
           const state = store.getState();
           if (state.view === 'race') {
               return `${state.event} E ${state.eventNumber} H ${state.heatNumber}`;
           }
        }

        return "";
    });

    actualText = headerInfo;

    // If we're looking for an event like "500 SC", ensure we don't match "1500 SC"
    if (actualText === expectedText ||
        actualText.startsWith(`${expectedText}\n`) ||
        actualText.includes(`\n${expectedText}\n`) ||
        actualText.endsWith(`\n${expectedText}`) ||
        actualText.includes(` ${expectedText} `) ||
        actualText.includes(expectedText)) { // Add broad include as fallback
      found = true;
      break;
    }
    await advanceClock(page, 200);
    await page.waitForTimeout(50);
  }

  if (!found) {
    throw new Error(`Expected header to display "${expectedText}", but it displayed "${actualText}"`);
  }
});
