import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I view the Pool3D component', async function (this: CustomWorld) {
    if (!this.page) throw new Error("Page not initialized");
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    await this.page.goto(`${baseUrl}/practice?testMode=true`);
    await this.page.waitForLoadState('networkidle');

    // Click on 'Start' button
    await this.page.getByTestId('start-button').click();
});
