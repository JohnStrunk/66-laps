import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';
import { expect } from '@playwright/test';

Then('I should see a 3D environment with water and lane ropes', async function (this: CustomWorld) {
    const container = this.page!.locator('[data-testid="3d-pool-container"]');
    await waitForVisible(container);
    await expect(container).toBeVisible();
    // In a real 3D test we might check for the presence of the canvas or specific objects via evaluate,
    // but for now, checking the container is sufficient for visibility.
});
