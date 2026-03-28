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

    // Retrieve the remaining time for the swimmer to finish
    const remainingTime = await page.evaluate(`(function(idx) {
        var swimmers = window.__TEST_SWIMMERS__;
        if (!swimmers || !swimmers[idx]) return null;
        var s = swimmers[idx];
        var now = Date.now();
        if (s.isDone(now)) return 0;

        // Calculate the total time the swimmer takes for the race
        var totalLaps = s._lapTimes ? s._lapTimes.length : (s.lapTimes ? s.lapTimes.length : 0);
        var totalTimeSec = 0;
        for (var i = 0; i < totalLaps; i++) {
            totalTimeSec += (s._lapTimes || s.lapTimes)[i];
        }

        var startTime = s._startTimeMs || now;
        return Math.max(0, (startTime + totalTimeSec * 1000) - now);
    })(${laneIndex})`);

    if (remainingTime === null || typeof remainingTime !== 'number') {
        throw new Error(`Could not determine finish time for lane ${lane}`);
    }

    if (remainingTime > 0) {
        const chunkMs = 60000;
        let elapsed = 0;
        while (elapsed < remainingTime + 100) {
            const step = Math.min(chunkMs, (remainingTime + 100) - elapsed);
            await advanceClock(page, step);
            elapsed += step;
            await page.waitForTimeout(10);
        }
    }

    // Verify it is actually done
    const isDone = await page.evaluate(`(function(idx) {
        var swimmers = window.__TEST_SWIMMERS__;
        return swimmers && swimmers[idx] && swimmers[idx].isDone(Date.now());
    })(${laneIndex})`);

    if (!isDone) {
        throw new Error(`Lane ${lane} did not finish after advancing clock by ${remainingTime}ms`);
    }
});
