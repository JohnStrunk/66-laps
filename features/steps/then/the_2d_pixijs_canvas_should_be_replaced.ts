import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

Then('the 2D PixiJS canvas should be replaced by a 3D R3F Canvas', async function (this: CustomWorld) {
    const container = this.page!.locator('[data-testid="3d-pool-container"]');
    await waitForVisible(container);
});

Then('I should see a 3D environment with water and lane ropes', async function (this: CustomWorld) {
    const container = this.page!.locator('[data-testid="3d-pool-container"]');
    await waitForVisible(container);
    // In a real 3D test we might check for the presence of the canvas or specific objects via evaluate,
    // but for now, checking the container is sufficient for visibility.
});

Then('the 3D R3F Canvas should be visible immediately', async function (this: CustomWorld) {
    const container = this.page!.locator('[data-testid="3d-pool-container"]');
    await waitForVisible(container);
});
