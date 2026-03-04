import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';
import { expect } from '@playwright/test';

Then('swimmers heading toward the turn end should move from right to left on the screen', async function (this: CustomWorld) {
    const container = this.page!.locator('[data-starting-end="RIGHT"]');
    await waitForVisible(container);
    await expect(container).toBeVisible();
});
