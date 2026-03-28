import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';
import { TestWindow } from '../../../src/modules/testTypes';
import { ISwimmer } from '../../../src/modules/SwimmerModel';

When('I wait for the race to complete', async function (this: CustomWorld) {
    const page = this.page!;

    const remainingTime = await page.evaluate(() => {
        const testWin = window as unknown as TestWindow;
        const swimmers = testWin.__TEST_SWIMMERS__ as Array<ISwimmer & { _lapTimes?: number[]; _startTimeMs?: number }>;
        if (!swimmers || swimmers.length === 0) return null;

        let maxFinishTimeMs = 0;
        const now = Date.now();

        for (const s of swimmers) {
            if (s.isDone(now)) continue;

            const laps = s._lapTimes || s.lapTimes;
            if (!laps) continue;

            let totalTimeSec = 0;
            for (let i = 0; i < laps.length; i++) {
                totalTimeSec += laps[i];
            }

            const finishTimeMs = (s._startTimeMs || now) + totalTimeSec * 1000;
            if (finishTimeMs > maxFinishTimeMs) {
                maxFinishTimeMs = finishTimeMs;
            }
        }

        if (maxFinishTimeMs === 0) return 0; // all done

        return Math.max(0, maxFinishTimeMs - now);
    });

    if (remainingTime === null || typeof remainingTime !== 'number') {
        throw new Error('Could not determine remaining time for race completion');
    }

    if (remainingTime > 0) {
        // We chunk the clock advancement to give the event loop time to process events and not crash the Playwright execution
        // if the time is incredibly large, but usually for a 1650 it's 15 mins which is 900,000ms.
        // Fast forwarding 15 minutes is instant in terms of test time, but we should yield occasionally.
        const chunkMs = 60000; // 1 minute chunks
        let elapsed = 0;
        while (elapsed < remainingTime + 100) {
            const step = Math.min(chunkMs, (remainingTime + 100) - elapsed);
            await advanceClock(page, step);
            elapsed += step;
            await page.waitForTimeout(10); // yield to event loop
        }
    }

    // Verify it is actually done
    const isDone = await page.evaluate(() => {
        const testWin = window as unknown as TestWindow;
        const swimmers = testWin.__TEST_SWIMMERS__;
        if (!swimmers) return false;
        return swimmers.every((s: ISwimmer) => s.isDone(Date.now()));
    });

    if (!isDone) {
        throw new Error(`Race did not complete after advancing clock by ${remainingTime}ms`);
    }
});
