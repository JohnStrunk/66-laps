import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';
import { TestWindow } from '../../../src/modules/testTypes';
import { ISwimmer } from '../../../src/modules/SwimmerModel';

When('I wait for the race to complete', async function (this: CustomWorld) {
    // A 1500m race might take 15-20 minutes depending on speed.
    // Instead of waiting in real-time, aggressively fast-forward the simulation
    // in chunks until all swimmers are done.

    let isDone = false;
    for (let i = 0; i < 400; i++) { // Max ~33 minutes of simulated time
        await advanceClock(this.page!, 5000); // 5 seconds per tick

        isDone = await this.page!.evaluate(() => {
            const testWin = window as unknown as TestWindow;
            const swimmers = testWin.__TEST_SWIMMERS__;
            if (!swimmers || swimmers.length === 0) return false;
            return swimmers.every((s: ISwimmer) => s.isDone(Date.now()));
        });

        if (isDone) {
            break;
        }
    }

    if (!isDone) {
        throw new Error('Race did not complete within the simulated time limit.');
    }
});
