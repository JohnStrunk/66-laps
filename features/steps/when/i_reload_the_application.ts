import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I reload the application', async function (this: CustomWorld) {
    await this.page!.reload();
    await this.page!.waitForSelector('text=Settings');
});
