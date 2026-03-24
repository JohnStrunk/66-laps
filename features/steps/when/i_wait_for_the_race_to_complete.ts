import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForCondition } from '../../support/utils';
import { TestWindow } from '../../../src/modules/testTypes';
import { ISwimmer } from '../../../src/modules/SwimmerModel';

When('I wait for the race to complete', async function (this: CustomWorld) {
    await waitForCondition(this.page!, async () => {
        return await this.page!.evaluate(() => {
            const testWin = window as unknown as TestWindow;
            // Check if all swimmers in __TEST_SWIMMERS__ are done
            const swimmers = testWin.__TEST_SWIMMERS__;
            if (!swimmers || swimmers.length === 0) return false;
            return swimmers.every((s: ISwimmer) => s.isDone(Date.now()));
        });
    }, 60000); // 1 minute timeout for simulation completion
});
