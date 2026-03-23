import { CustomWorld } from '../../support/world';
import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { TestWindow } from '../../../src/modules/testTypes';

Then('the 3D swimmers should start at the start end', async function (this: CustomWorld) {
    const data = await this.page!.evaluate(() => {
        const testWin = window as unknown as TestWindow;
        const model = testWin.__TEST_SWIMMER_0_MODEL__;
        if (!model) return null;
        return { location: model.where(Date.now()).location };
    });
    // Location 0 means start end. Allow slight movement if clock advanced.
    expect(data?.location).toBeDefined();
    expect(data?.location).toBeLessThan(0.1);
});
