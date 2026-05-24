import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Given('the user navigates to the race history screen', async function (this: CustomWorld) {
  // Ensure the History button is visible and click it to open the history view
  await this.page!.waitForSelector('[data-testid="history-button"]', { state: 'visible' });
  await this.page!.click('[data-testid="history-button"]');
  // Wait for the History view to be rendered
  await this.page!.waitForSelector('[data-testid="history-view"]');
});
