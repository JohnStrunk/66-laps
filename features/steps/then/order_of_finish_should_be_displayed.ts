import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('{string} should be displayed in the order of finish on the {word} pool deck', async function (this: CustomWorld, expectedOof: string, _mode: string) {
    if (!_mode) throw new Error('mode is required');
    const oof = this.page!.locator('[data-testid="order-of-finish"]');
    await expect(oof).toBeAttached();

    await expect.poll(async () => {
        const actualOof = await oof.textContent();
        if (actualOof?.trim() === expectedOof) {
            return true;
        }
        const attrOof = await oof.getAttribute('data-oof-value');
        if (attrOof === expectedOof) {
            return true;
        }
        return false;
    }, { timeout: 10000 }).toBe(true);
});
