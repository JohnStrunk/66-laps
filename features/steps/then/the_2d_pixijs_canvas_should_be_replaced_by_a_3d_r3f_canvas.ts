import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the 2D PixiJS canvas should be replaced by a 3D R3F Canvas', async function (this: CustomWorld) {
    const container = this.page!.locator('[data-testid="3d-pool-container"]');
    await waitForVisible(container);
    await expect(container).toBeVisible();
});
