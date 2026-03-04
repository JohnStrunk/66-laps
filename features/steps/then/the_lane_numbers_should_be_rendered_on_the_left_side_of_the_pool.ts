import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the lane numbers should be rendered on the left side of the pool', async function (this: CustomWorld) {
    // Assert visual indicator in DOM (e.g., data attribute on pool container)
    const container = this.page!.locator('[data-starting-end="LEFT"]');
    await waitForVisible(container);
    await expect(container).toBeVisible();
});
