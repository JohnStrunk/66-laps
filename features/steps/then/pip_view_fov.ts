import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';
import { TestWindow } from '@/modules/testTypes';

Then('the PIP view should have a 60 degree field of view', async function (this: CustomWorld) {
    const testData = await this.page!.evaluate(() => {
        return (window as unknown as TestWindow).__TEST_DATA__;
    });
    if (!testData) throw new Error('__TEST_DATA__ not found');
    const data = JSON.parse(testData);
    expect(Math.round(data.pipCamera.fov)).toBe(60);
});
