import os

content1 = """import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Given('I have a device that does not support WebGL', async function (this: CustomWorld) {
    if (!this.page) throw new Error("Page not initialized");
    // Intercept context creation before the page loads
    await this.page.addInitScript(() => {
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, options?: any) {
            if (contextId === 'webgl' || contextId === 'experimental-webgl' || contextId === 'webgl2') {
                return null;
            }
            // TypeScript doesn't like passing 'options' if it expects only 1 argument for some overloads,
            // so we cast to any to call it genericly
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (originalGetContext as any).call(this, contextId, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
    });
});
"""

content2 = """import { When } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

When('I view the Pool3D component', async function (this: CustomWorld) {
    if (!this.page) throw new Error("Page not initialized");
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    await this.page.goto(`${baseUrl}/practice?testMode=true`);
    await this.page.waitForLoadState('networkidle');

    // Click on 'Start' button
    await this.page.getByTestId('start-button').click();
});
"""

content3 = """import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

Then('I should see the WebGL fallback message', async function (this: CustomWorld) {
    if (!this.page) throw new Error("Page not initialized");
    const fallbackText = this.page.locator('text="WebGL not available. Shadow Mock is active."');
    await expect(fallbackText).toBeVisible({ timeout: 5000 });
});
"""

with open("features/steps/given/i_have_a_device_that_does_not_support_webgl.ts", "w") as f:
    f.write(content1)

with open("features/steps/when/i_view_the_pool3d_component.ts", "w") as f:
    f.write(content2)

with open("features/steps/then/i_should_see_the_webgl_fallback_message.ts", "w") as f:
    f.write(content3)

os.remove("features/steps/webgl-fallback.ts")
