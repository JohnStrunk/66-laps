import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';

Then('the header should not display {string}', async function (this: CustomWorld, unexpectedText: string) {
  const page = this.page!;

  await advanceClock(page, 500);

  // Extract text content using evaluate to avoid timeout issues with Playwright visibility checks under mock clock
  const textContent = await page.evaluate(() => {
    const headerEl = document.querySelector('[data-testid="bell-lap-header"]');
    if (headerEl) {
       return (headerEl as HTMLElement).innerText || headerEl.textContent || "";
    }

    // Fallback to store
    const store = (window as unknown as import('../../support/store-type').TestWindow).__bellLapStore;
    if (store) {
       const state = store.getState();
       if (state.view === 'race') {
           return `${state.event} E ${state.eventNumber} H ${state.heatNumber}`;
       }
    }

    return "";
  });

  if (textContent.includes(unexpectedText)) {
    throw new Error(`Expected header NOT to display "${unexpectedText}", but it displayed "${textContent}"`);
  }
});
