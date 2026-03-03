import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForHidden, advanceClock } from '../../support/utils';

Then('I should see exactly {int} swimmers represented as emojis on the 2D canvas', async function (this: CustomWorld, count: number) {
    const form = this.page!.locator('form');
    await waitForHidden(form);

    for (let i = 0; i < 10; i++) {
        await advanceClock(this.page!, 100);
        await this.page!.waitForTimeout(50);
    }

    const container = this.page!.locator(`[data-swimmer-count="${count}"]`);
    await container.waitFor({ state: 'visible', timeout: 5000 });
});
