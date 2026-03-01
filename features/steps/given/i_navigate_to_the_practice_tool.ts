import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Given('I navigate to the Practice tool', async function (this: CustomWorld) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    await this.page!.goto(`${baseUrl}/practice`);
    // Wait for the Settings screen to render so we know we are ready
    await this.page!.waitForSelector('text=Settings');
});
