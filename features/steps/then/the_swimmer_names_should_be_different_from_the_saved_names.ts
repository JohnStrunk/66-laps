import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the swimmer names should be different from the saved names', async function (this: CustomWorld) {
    const currentSwimmers = await this.page!.evaluate(() => {
        const swimmers = (window as unknown as { __TEST_SWIMMERS__: { avatar: { emoji: string } }[] }).__TEST_SWIMMERS__;
        return swimmers.map((s) => s.avatar.emoji);
    });
    expect(currentSwimmers).not.toEqual(this.savedSwimmers);
});
