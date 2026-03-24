import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../../src/modules/testTypes';

Then('the 3D swimmers should be at the start end and isDone should be true', async function (this: CustomWorld) {
    const container = this.page!.locator('[data-test-ready="true"]').first();
    await container.waitFor({ state: 'visible' });
    const data = await container.evaluate((el) => JSON.parse(el.getAttribute('data-test-data')!));

    // Swimmer 0 position should be at start wall (location 0)
    const swimmer0 = data.swimmers[0];
    expect(swimmer0.location).toBeLessThan(0.1);

    // Also verify isDone on the model
    const isDone = await this.page!.evaluate(() => {
        const testWin = window as unknown as TestWindow;
        const model = testWin.__TEST_SWIMMER_0_MODEL__;
        return model?.isDone(Date.now());
    });
    expect(isDone).toBe(true);
});
