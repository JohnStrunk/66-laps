import { Given } from '@cucumber/cucumber';
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
