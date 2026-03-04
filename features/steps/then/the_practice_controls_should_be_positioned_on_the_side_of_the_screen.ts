import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

Then('the practice controls should be positioned on the {word} side of the screen', async function (this: CustomWorld, side: string) {
    const page = this.page!;
    const controls = page.locator('[data-testid="practice-controls"]');

    // Wait for it to be visible
    await expect(controls).toBeVisible();

    const boundingBox = await controls.boundingBox();
    expect(boundingBox).not.toBeNull();

    const viewport = page.viewportSize();
    expect(viewport).not.toBeNull();

    if (side.toLowerCase() === 'left') {
        // Center of the controls should be in the left half of the screen
        expect(boundingBox!.x + boundingBox!.width / 2).toBeLessThan(viewport!.width / 2);
    } else if (side.toLowerCase() === 'right') {
        // Center of the controls should be in the right half of the screen
        expect(boundingBox!.x + boundingBox!.width / 2).toBeGreaterThan(viewport!.width / 2);
    } else {
        throw new Error(`Invalid side: ${side}. Expected 'left' or 'right'.`);
    }
});
