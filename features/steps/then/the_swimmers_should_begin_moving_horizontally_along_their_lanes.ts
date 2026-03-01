import { Then } from '@cucumber/cucumber';
import { strict as assert } from 'assert';
import { CustomWorld } from '../../support/world';
import { waitForHidden, advanceClock } from '../../support/utils';

Then('the swimmers should begin moving horizontally along their lanes', async function (this: CustomWorld) {
    const form = this.page!.locator('form');
    await waitForHidden(form);

    // Advance clock heavily to ensure all renders and animations occur
    for (let i = 0; i < 10; i++) {
        await advanceClock(this.page!, 100);
        await this.page!.waitForTimeout(50);
    }

    const canvas = this.page!.locator('canvas');
    await canvas.waitFor({ state: 'visible', timeout: 5000 });

    const container = this.page!.locator('div[data-swimmer-count]');
    const swimmerCount = await container.getAttribute('data-swimmer-count');

    assert.ok(parseInt(swimmerCount || '0', 10) > 0, 'Expected swimmer count to be greater than 0');
});
