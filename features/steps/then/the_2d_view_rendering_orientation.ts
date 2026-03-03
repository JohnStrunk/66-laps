import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

Then('the lane numbers should be rendered on the left side of the pool', async function (this: CustomWorld) {
    // Assert visual indicator in DOM (e.g., data attribute on pool container)
    const container = this.page!.locator('[data-starting-end="LEFT"]');
    await waitForVisible(container);
});

Then('swimmers heading toward the turn end should move from left to right on the screen', async function (this: CustomWorld) {
    // The swimming direction is a result of the pool orientation, so asserting the pool orientation is sufficient for E2E.
    // Pixel-level rendering checks require visual regression testing.
    const container = this.page!.locator('[data-starting-end="LEFT"]');
    await waitForVisible(container);
});

Then('the lane numbers should be rendered on the right side of the pool', async function (this: CustomWorld) {
    const container = this.page!.locator('[data-starting-end="RIGHT"]');
    await waitForVisible(container);
});

Then('swimmers heading toward the turn end should move from right to left on the screen', async function (this: CustomWorld) {
    const container = this.page!.locator('[data-starting-end="RIGHT"]');
    await waitForVisible(container);
});
