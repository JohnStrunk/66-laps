import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

Then('I should see the WebGL fallback message', async function (this: CustomWorld) {
    if (!this.page) throw new Error("Page not initialized");
    const fallbackText = this.page.locator('text="WebGL not available. Shadow Mock is active."');
    await expect(fallbackText).toBeVisible({ timeout: 5000 });
});
