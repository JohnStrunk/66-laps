import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';
import { TestWindow } from '@/modules/testTypes';

Then('I should see a picture-in-picture view', async function (this: CustomWorld) {
    const testData = await this.page!.evaluate(() => {
        return (window as unknown as TestWindow).__TEST_DATA__;
    });
    if (!testData) throw new Error('__TEST_DATA__ not found');
    const data = JSON.parse(testData);
    expect(data.pipCamera).toBeDefined();
});
