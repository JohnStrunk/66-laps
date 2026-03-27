import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';

When('lane {int} finishes {word}', async function (this: CustomWorld, lane: number, _order: string) {
    if (!_order) throw new Error('order is required');
    const page = this.page!;

    // Find the index of this lane
    const lanes = await page.getAttribute('[data-swimmer-count]', 'data-swimmer-count');
    const numbering = await page.getAttribute('[data-numbering]', 'data-numbering');
    const totalLanes = parseInt(lanes || '8');

    let laneIndex = lane - 1;
    if (numbering === 'AWAY') {
        laneIndex = totalLanes - lane;
    }

    const timeoutMs = 15000;
    const chunkMs = 5000;
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
        const isDone = await page.evaluate(`(function(idx) {
            var swimmers = window.__TEST_SWIMMERS__;
            return swimmers && swimmers[idx] && swimmers[idx].isDone(Date.now());
        })(${laneIndex})`);

        if (isDone) {
            return;
        }

        await advanceClock(page, chunkMs);
        await page.waitForTimeout(20);
    }

    throw new Error(`Condition timed out after ${timeoutMs}ms waiting for lane ${lane} to finish`);
});
