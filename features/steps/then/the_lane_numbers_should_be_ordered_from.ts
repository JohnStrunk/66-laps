import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForHidden, advanceClock } from '../../support/utils';
import { expect } from '@playwright/test';

Then('the lane numbers should be ordered from {word} to {word}', async function (this: CustomWorld, word1: string, word2: string) {
    const form = this.page!.locator('form');
    await waitForHidden(form);
    await expect(form).toBeHidden();

    // Advance clock heavily to ensure all renders and animations occur
    for (let i = 0; i < 10; i++) {
        await advanceClock(this.page!, 100);
        await this.page!.waitForTimeout(50);
    }

    const orderStr = `${word1} to ${word2}`;
    let expectedDirection = '';

    if (orderStr === 'bottom to top') {
        expectedDirection = 'AWAY';
    } else if (orderStr === 'top to bottom') {
        expectedDirection = 'TOWARDS';
    } else {
        throw new Error(`Unknown ordering direction: ${orderStr}`);
    }

    const container = this.page!.locator(`[data-numbering="${expectedDirection}"]`);
    await expect(container).toBeVisible();
});
