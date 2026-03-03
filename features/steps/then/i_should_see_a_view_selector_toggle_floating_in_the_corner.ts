import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

Then('I should see a {string} view selector toggle floating in the corner', async function (this: CustomWorld, toggleText: string) {
    if (toggleText) {
        const toggle2D = this.page!.locator('[data-testid="view-selector"] button:has-text("2D")');
        const toggle3D = this.page!.locator('[data-testid="view-selector"] button:has-text("3D")');
        await waitForVisible(toggle2D);
        await waitForVisible(toggle3D);
    }
});
