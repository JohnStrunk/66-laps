import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForHidden, advanceClock } from '../../support/utils';

Then('I should see the 2D PixiJS canvas', async function (this: CustomWorld) {
    const form = this.page!.locator('form');
    await waitForHidden(form);

    // Advance clock heavily to ensure all renders and animations occur
    for (let i = 0; i < 10; i++) {
        await advanceClock(this.page!, 100);
        await this.page!.waitForTimeout(50); // yield to event loop
    }

    const canvas = this.page!.locator('canvas');
    await canvas.waitFor({ state: 'visible', timeout: 5000 });
});
