import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock, waitForCondition } from '../../support/utils';
import { TestWindow } from '../../../src/modules/testTypes';
import { ISwimmer } from '../../../src/modules/SwimmerModel';

When('I wait for the race to complete', async function (this: CustomWorld) {
    // Fast-forward by a large amount of time to instantly finish the race
    // We can jump ahead 10 minutes (600,000 ms)
    await advanceClock(this.page!, 600000);

    await waitForCondition(this.page!, async () => {
        return await this.page!.evaluate(() => {
            const testWin = window as unknown as TestWindow;
            const swimmers = testWin.__TEST_SWIMMERS__;
            if (!swimmers || swimmers.length === 0) return false;
            return swimmers.every((s: ISwimmer) => s.isDone(Date.now()));
        });
    }, 5000);
});
