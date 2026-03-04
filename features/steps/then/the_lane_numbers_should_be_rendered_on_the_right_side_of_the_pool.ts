import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the lane numbers should be rendered on the right side of the pool', async function (this: CustomWorld) {
    const container = this.page!.locator('[data-starting-end="RIGHT"]');
    await waitForVisible(container);
    await expect(container).toBeVisible();
});
