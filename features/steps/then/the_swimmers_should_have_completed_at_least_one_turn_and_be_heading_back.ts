import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';
import { waitFor3DReady } from '../../support/utils';

Then('the swimmers should have completed at least one turn and be heading back', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    const container = this.page!.locator('[data-testid="3d-pool-container"]');
    const data = await container.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));
    // direction -1 means heading back towards start
    expect(data.swimmer0.rotation.y).toBeCloseTo(-Math.PI / 2);
});
