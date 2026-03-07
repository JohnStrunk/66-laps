import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';
import { TestWindow } from '@/modules/testTypes';

Then('the PIP camera should be at the same position as the main camera', async function (this: CustomWorld) {
    const testData = await this.page!.evaluate(() => {
        return (window as unknown as TestWindow).__TEST_DATA__;
    });
    if (!testData) throw new Error('__TEST_DATA__ not found');
    const data = JSON.parse(testData);
    expect(data.pipCamera.position.x).toBeCloseTo(data.camera.position.x, 2);
    expect(data.pipCamera.position.y).toBeCloseTo(data.camera.position.y, 2);
    expect(data.pipCamera.position.z).toBeCloseTo(data.camera.position.z, 2);
});
