import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';
import { TestWindow } from '../../../src/modules/testTypes';
import { ISwimmer } from '../../../src/modules/SwimmerModel';

When('I wait for the race to complete', async function (this: CustomWorld) {
    const page = this.page!;
    const timeoutMs = 60000;
    const chunkMs = 5000;
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
        const isDone = await page.evaluate(() => {
            const testWin = window as unknown as TestWindow;
            const swimmers = testWin.__TEST_SWIMMERS__;
            if (!swimmers || swimmers.length === 0) return false;
            return swimmers.every((s: ISwimmer) => s.isDone(Date.now()));
        });

        if (isDone) {
            return;
        }

        await advanceClock(page, chunkMs);
        await page.waitForTimeout(20);
    }

    throw new Error(`Condition timed out after ${timeoutMs}ms waiting for the race to complete`);
});
