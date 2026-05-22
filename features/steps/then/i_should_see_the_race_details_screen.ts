import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('I should see the race details screen', async function (this: CustomWorld) {
  const detailsView = this.page!.locator('[data-testid="race-details-view"]');
  const visible = await detailsView.isVisible();

  if (!visible) {
    const loadingView = this.page!.locator('[data-testid="race-details-loading"]');
    if (await loadingView.isVisible()) {
      const mounted = await loadingView.getAttribute('data-mounted');
      const hasRace = await loadingView.getAttribute('data-has-race');
      const selectedId = await loadingView.getAttribute('data-selected-id');
      const count = await loadingView.getAttribute('data-history-count');
      throw new Error(`Race details view not visible. Loading view state: mounted=${mounted}, hasRace=${hasRace}, selectedId=${selectedId}, historyCount=${count}`);
    }
  }

  expect(visible).toBe(true);
});
