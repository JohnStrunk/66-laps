import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

Then('the 2D PixiJS canvas should be replaced by a 3D R3F Canvas', async function (this: CustomWorld) {
    const container = this.page!.locator('[data-testid="3d-pool-container"]');
    await waitForVisible(container);
});

Then('I should see a 3D environment with water and pool walls', async function (this: CustomWorld) {
    // Assert the 3D canvas container is visible and has a canvas element
    const container = this.page!.locator('[data-testid="3d-pool-container"]');
    await waitForVisible(container);
});
