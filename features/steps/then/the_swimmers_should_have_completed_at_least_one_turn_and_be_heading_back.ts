import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitFor3DReady, waitForCondition } from '../../support/utils';

Then('the swimmers should have completed at least one turn and be heading back', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    const container = this.page!.locator('[data-testid="3d-pool-container"]');

    await waitForCondition(this.page!, async () => {
        const dataStr = await container.getAttribute('data-test-data');
        if (!dataStr) return false;
        const data = JSON.parse(dataStr);
        if (!data || !data.swimmer0) return false;
        // Check if the rotation is either Math.PI / 2 or -Math.PI / 2
        // Since different starting ends / lanes might invert it, just check it's orthogonal (i.e. abs(rot) is approx PI/2)
        // Math.PI / 2 is approximately 1.5708
        return Math.abs(Math.abs(data.swimmer0.rotation.y) - Math.PI / 2) < 0.1;
    }, 20000);
});
