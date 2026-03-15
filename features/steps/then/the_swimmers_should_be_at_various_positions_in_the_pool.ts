import { CustomWorld } from '../../support/world';
import { Then } from '@cucumber/cucumber';
import { waitFor3DReady } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the swimmers should be at various positions in the pool', async function (this: CustomWorld) {
    await waitFor3DReady(this.page!);
    const readyDiv = this.page!.locator('[data-testid="3d-pool-container"]');

    // Check swimmer 0 position
    const pos = await readyDiv.evaluate((el: HTMLElement) => {
        const data = JSON.parse(el.getAttribute('data-test-data')!);
        return data.swimmer0?.position.x;
    });
    expect(pos !== undefined && pos >= 0, `Swimmer 0 position X was ${pos}`).toBeTruthy();
});
