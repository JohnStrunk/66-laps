import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the 3D R3F Canvas should be visible immediately', async function (this: CustomWorld) {
    const container = this.page!.locator('[data-testid="3d-pool-container"]');
    await waitForVisible(container);
    await expect(container).toBeVisible();
});
