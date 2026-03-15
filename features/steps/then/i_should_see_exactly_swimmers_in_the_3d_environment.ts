import { CustomWorld } from '../../support/world';
import { Then } from '@cucumber/cucumber';
import { waitFor3DReady } from '../../support/utils';
import { expect } from '@playwright/test';

Then('I should see exactly {int} swimmers in the 3D environment', async function (this: CustomWorld, int: number) {
    await waitFor3DReady(this.page!);
    const readyDiv = this.page!.locator('[data-testid="3d-pool-container"]');
    const count = await readyDiv.getAttribute('data-swimmer-count');
    expect(parseInt(count!)).toBe(int);
});
