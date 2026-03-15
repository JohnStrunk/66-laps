import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { advanceClock } from '../../support/utils';

Given('I navigate to the Practice tool', async function (this: CustomWorld) {
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    await this.page!.goto(`${baseUrl}/practice?testMode=true`, { timeout: 60000 });
    // Wait for the Settings screen to render so we know we are ready
    await this.page!.waitForSelector('text=Settings', { timeout: 60000 });
    // Advance clock to ensure hydration
    await advanceClock(this.page!, 1000);
});
