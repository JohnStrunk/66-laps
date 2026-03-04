import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('{string} should be displayed in the order of finish on the {word} pool deck', async function (this: CustomWorld, expectedOof: string, mode: string) {
    const oof = this.page!.locator('[data-testid="order-of-finish"]');
    await expect(oof).toBeAttached();

    // We check the text content or a data attribute
    const actualOof = await oof.textContent();
    if (actualOof?.trim() !== expectedOof) {
        // Try data attribute as fallback for 3D/Canvas
        const attrOof = await oof.getAttribute('data-oof-value');
        expect(attrOof).toBe(expectedOof);
    } else {
        expect(actualOof?.trim()).toBe(expectedOof);
    }
});
