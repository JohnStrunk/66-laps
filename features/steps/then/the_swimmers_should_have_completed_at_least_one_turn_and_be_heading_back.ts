import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitFor3DReady, waitForCondition } from '../../support/utils';

Then('the swimmers should have completed at least one turn and be heading back', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    const container = this.page!.locator('[data-testid="3d-pool-container"]');

    await waitForCondition(this.page!, async () => {
        const data = await container.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));
        if (!data || !data.swimmer0) return false;
        // rotation.y should be -PI/2 (approx -1.57) when heading back
        return Math.abs(data.swimmer0.rotation.y + Math.PI / 2) < 0.1;
    }, 20000);
});
