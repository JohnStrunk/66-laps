import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the 2D canvas width should be less than or equal to {int}', async function (this: CustomWorld, maxWidth: number) {
    const canvas = this.page!.locator('canvas');
    await expect(canvas).toBeVisible();

    await expect.poll(async () => {
        const box = await canvas.boundingBox();
        return box ? box.width : 9999;
    }).toBeLessThanOrEqual(maxWidth);
});
