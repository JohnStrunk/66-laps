import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';
import { TestWindow } from '@/modules/testTypes';

Then('the PIP view should be in the top-right corner when starting end is {string}', async function (this: CustomWorld, _startingEnd: string) {
    const testData = await this.page!.evaluate(() => {
        return (window as unknown as TestWindow).__TEST_DATA__;
    });
    if (!testData) throw new Error('__TEST_DATA__ not found');
    const data = JSON.parse(testData);
    expect(data.pipPosition).toBe('top-right');
});

Then('the PIP view should be in the top-left corner when starting end is {string}', async function (this: CustomWorld, _startingEnd: string) {
    const testData = await this.page!.evaluate(() => {
        return (window as unknown as TestWindow).__TEST_DATA__;
    });
    if (!testData) throw new Error('__TEST_DATA__ not found');
    const data = JSON.parse(testData);
    expect(data.pipPosition).toBe('top-left');
});
