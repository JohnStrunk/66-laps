import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForCondition } from '../../support/utils';

When('lane {int} finishes {word}', async function (this: CustomWorld, lane: number, order: string) {
    const page = this.page!;

    // Find the index of this lane
    const lanes = await page.getAttribute('[data-swimmer-count]', 'data-swimmer-count');
    const numbering = await page.getAttribute('[data-numbering]', 'data-numbering');
    const totalLanes = parseInt(lanes || '8');

    let laneIndex = lane - 1;
    if (numbering === 'AWAY') {
        laneIndex = totalLanes - lane;
    }

    await waitForCondition(page, async function() {
        return await page.evaluate(`(function(idx) {
            var swimmers = window.__TEST_SWIMMERS__;
            return swimmers && swimmers[idx] && swimmers[idx].isDone(Date.now());
        })(${laneIndex})`);
    });
});
