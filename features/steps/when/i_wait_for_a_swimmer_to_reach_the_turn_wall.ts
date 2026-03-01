import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I wait for a swimmer to reach the turn wall', async function (this: CustomWorld) {
    // 500 SC is 20 laps. A lap is roughly 16 seconds on average.
    // If we advance the clock by 15 seconds, someone should reach the wall soon.
    // Let's advance the clock by 20 seconds to ensure a flip occurs.
    // We use fastForward directly to do it efficiently in a single RPC call.
    await this.page!.clock.fastForward(20000);
    // Yield to the event loop so rendering catches up
    await this.page!.waitForTimeout(500);
});
