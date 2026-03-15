import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';
import { waitFor3DReady } from '../../support/utils';

Then('the 3D camera should be positioned on the deck looking toward the left', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    const container = this.page!.locator('[data-testid="3d-pool-container"]');
    const data = await container.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));

    // For RIGHT start, camera looks toward LEFT (negative rotation in Y)
    // -Math.PI / 4 is 45 degrees to the left
    expect(data.pipCamera.rotation.y).toBeCloseTo(Math.PI / 4);
});
