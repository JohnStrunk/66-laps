import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I wait for {int} seconds to elapse', async function (this: CustomWorld, seconds: number) {
    await this.page!.clock.fastForward(seconds * 1000);
    // Yield to the event loop
    await this.page!.waitForTimeout(500);
});
