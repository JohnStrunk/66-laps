import { CustomWorld } from '../../support/world';
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { TestWindow } from '../../../src/modules/testTypes';

Then('the practice lap count should be {int}', async function (this: CustomWorld, expectedLaps: number) {
    await expect.poll(async () => {
        return await this.page!.evaluate(() => {
            const testWin = window as unknown as TestWindow;
            const model = testWin.__TEST_SWIMMER_0_MODEL__;
            if (!model) return null;
            // @ts-expect-error - _lapTimes is private but available in JS
            return model._lapTimes?.length;
        });
    }, { timeout: 10000 }).toBe(expectedLaps);
});
