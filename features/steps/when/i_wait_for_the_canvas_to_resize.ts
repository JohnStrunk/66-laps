import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I wait for the canvas to resize', async function (this: CustomWorld) {
    if (this.page) {
        // Trigger resize event
        await this.page.evaluate(() => window.dispatchEvent(new Event('resize')));
        // Wait for PixiJS to re-render
        await this.page.waitForTimeout(500);
    }
});
