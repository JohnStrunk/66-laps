import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitFor3DReady } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the 3D swimmers should be at a Y-coordinate of {float}', async function (this: CustomWorld, expectedY: number) {
    await waitFor3DReady(this.page!);
    const container = this.page!.locator('[data-testid="3d-pool-container"]');
    const data = await container.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));
    expect(data.swimmer0.position.y).toBe(expectedY);
});
