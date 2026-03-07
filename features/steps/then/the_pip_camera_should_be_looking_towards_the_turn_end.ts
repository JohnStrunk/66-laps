import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';
import { TestWindow } from '@/modules/testTypes';

Then('the PIP camera should be looking towards the turn end', async function (this: CustomWorld) {
    const testData = await this.page!.evaluate(() => {
        return (window as unknown as TestWindow).__TEST_DATA__;
    });
    if (!testData) throw new Error('__TEST_DATA__ not found');
    const data = JSON.parse(testData);

    // Main camera looks straight down the pool or slightly angled.
    // PIP camera should be rotated 180 degrees horizontally relative to the main view if looking at the other end.
    // Wait, let's check rotation instead of lookAt.
    // If main camera rotation.y is 0, and PIP camera rotation.y is Math.PI, that means they are looking in opposite directions.

    // In our case, the main camera looks at the same X but different Z.
    // The PIP camera should look at a different X.

    // Let's use rotation.y comparison.
    const mainRotY = data.camera.rotation.y;
    const pipRotY = data.pipCamera.rotation.y;

    // We expect them to be looking in diagonal directions
    // (main camera looks across lanes in Z, PIP looks diagonally)
    const diff = Math.abs(pipRotY - mainRotY);
    expect(diff % (2 * Math.PI)).toBeCloseTo(Math.PI / 4, 1);
});
