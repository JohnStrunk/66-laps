import { Given } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

Given('I have a device that does not support WebGL', async function (this: CustomWorld) {
    if (!this.page) throw new Error("Page not initialized");

    const mockFn = () => {
        const originalGetContext = HTMLCanvasElement.prototype.getContext;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        HTMLCanvasElement.prototype.getContext = function (this: HTMLCanvasElement, contextId: string, options?: any) {
            if (contextId === 'webgl' || contextId === 'experimental-webgl' || contextId === 'webgl2') {
                return null;
            }
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return (originalGetContext as any).call(this, contextId, options);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any;
    };

    // Intercept context creation before the page loads
    await this.page.addInitScript(mockFn);
    // Apply immediately to current context as well
    await this.page.evaluate(mockFn);

    const isWebGLDisabled = await this.page.evaluate(() => {
        const canvas = document.createElement('canvas');
        return canvas.getContext('webgl') === null && canvas.getContext('webgl2') === null;
    });
    expect(isWebGLDisabled).toBe(true);
});
