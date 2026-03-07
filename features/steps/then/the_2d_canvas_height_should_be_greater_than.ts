import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the 2D canvas height should be greater than {int}', async function (this: CustomWorld, minHeight: number) {
    const canvas = this.page!.locator('canvas');
    await expect(canvas).toBeVisible();

    await expect.poll(async () => {
        const box = await canvas.boundingBox();
        return box ? box.height : 0;
    }).toBeGreaterThan(minHeight);
});
