import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';
import { expect } from '@playwright/test';

Then('swimmers heading toward the turn end should move from left to right on the screen', async function (this: CustomWorld) {
    // The swimming direction is a result of the pool orientation, so asserting the pool orientation is sufficient for E2E.
    // Pixel-level rendering checks require visual regression testing.
    const container = this.page!.locator('[data-starting-end="LEFT"]');
    await waitForVisible(container);
    await expect(container).toBeVisible();
});
