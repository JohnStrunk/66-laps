import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../../src/modules/testTypes';

Then('the water shader uColor uniform should match the theme', async function (this: CustomWorld) {
    const { isDark, shaderColor } = await this.page!.evaluate(() => {
        const material = (window as unknown as TestWindow).__TEST_WATER_MATERIAL__;
        if (!material) return { isDark: false, shaderColor: null };
        const color = material.uniforms.uColor.value;
        return {
            isDark: document.documentElement.classList.contains('dark'),
            shaderColor: { r: color.r, g: color.g, b: color.b }
        };
    });

    expect(shaderColor).not.toBeNull();
    if (!shaderColor) throw new Error('shaderColor is null');

    // Expected colors (approximate):
    // Dark: #001133 (sRGB: 0, 0.066, 0.2) -> (Linear: 0, 0.003, 0.03)
    // Light: #0099ff (sRGB: 0, 0.6, 1.0) -> (Linear: 0, 0.318, 1.0)

    if (isDark) {
        expect(shaderColor.r).toBeCloseTo(0, 1);
        expect(shaderColor.g).toBeLessThan(0.1);
        expect(shaderColor.b).toBeLessThan(0.1); // Linear 0.2^2.2 is ~0.03
    } else {
        expect(shaderColor.r).toBeCloseTo(0, 1);
        expect(shaderColor.g).toBeGreaterThan(0.25);
        expect(shaderColor.g).toBeLessThan(0.4);
        expect(shaderColor.b).toBeGreaterThan(0.8);
    }
});
