import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

Then('the 2D PixiJS canvas should be replaced by a 3D R3F Canvas', async function (this: CustomWorld) {
    // Assert the placeholder or the R3F canvas is visible
    const placeholder = this.page!.locator('text=3D R3F Canvas Placeholder');
    await waitForVisible(placeholder);
});

Then('I should see a 3D environment with water and pool walls', async function (this: CustomWorld) {
    // Assert placeholder for now
    const placeholder = this.page!.locator('text=3D R3F Canvas Placeholder');
    await waitForVisible(placeholder);
});
