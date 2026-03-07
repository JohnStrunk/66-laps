import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';
import { advanceClock } from '../../support/utils';

Then('the 2D canvas width should be greater than {int}', async function (this: CustomWorld, minWidth: number) {
    const canvas = this.page!.locator('canvas');
    await expect(canvas).toBeVisible();

    await expect.poll(async () => {
        if (this.page) await advanceClock(this.page, 100);
        const box = await canvas.boundingBox();
        return box ? box.width : 0;
    }, { timeout: 10000 }).toBeGreaterThan(minWidth);
});
