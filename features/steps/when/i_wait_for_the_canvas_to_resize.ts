import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';

When('I wait for the canvas to resize', async function (this: CustomWorld) {
    if (this.page) {
        // Wait and advance mock clock if active, because PixiJS resize might rely on RAF or setTimeout
        await advanceClock(this.page, 500);
        // Explicitly trigger resize just in case
        await this.page.evaluate(() => window.dispatchEvent(new Event('resize')));
        await advanceClock(this.page, 500);
    }
});
