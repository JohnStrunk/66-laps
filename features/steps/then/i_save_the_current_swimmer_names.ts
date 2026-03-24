import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Then('I save the current swimmer names', async function (this: CustomWorld) {
    this.savedSwimmers = await this.page!.evaluate(() => {
        const swimmers = (window as unknown as { __TEST_SWIMMERS__: { avatar: { emoji: string } }[] }).__TEST_SWIMMERS__;
        return swimmers.map((s) => s.avatar.emoji);
    });
});
