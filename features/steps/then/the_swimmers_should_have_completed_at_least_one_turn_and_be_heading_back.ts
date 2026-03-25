import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitFor3DReady, advanceClock } from '../../support/utils';

Then('the swimmers should have completed at least one turn and be heading back', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    const container = this.page!.locator('[data-testid="3d-pool-container"]');

    // Fast-forward aggressively up to 60 seconds, checking every 2 seconds simulated
    let headingBack = false;
    for (let i = 0; i < 30; i++) {
        await advanceClock(this.page!, 2000);
        const data = await container.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));
        if (data && data.swimmer0) {
            if (Math.abs(data.swimmer0.rotation.y + Math.PI / 2) < 0.1) {
                headingBack = true;
                break;
            }
        }
    }

    if (!headingBack) {
        throw new Error('Swimmer did not complete a turn and head back within the expected time.');
    }
});
