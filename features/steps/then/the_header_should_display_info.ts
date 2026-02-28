import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Then('the header should display {string}', async function (this: CustomWorld, text: string) {
  await this.page!.waitForFunction((args) => {
    const { text, testId } = args;
    const header = document.querySelector(`[data-testid="${testId}"]`);
    if (!header) return false;
    const headerText = header.textContent || '';

    let match = headerText.includes(text);
    if (!match) {
      if (text.startsWith('Event ')) {
        match = headerText.includes('E ' + text.substring(6));
      } else if (text.startsWith('Heat ')) {
        match = headerText.includes('H ' + text.substring(5));
      }
    }
    return match;
  }, { text, testId: 'bell-lap-header' }, { timeout: 5000 });
});
