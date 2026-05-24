import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

/**
 * Sets the viewport width to 375px (iPhone X width) for mobile UI tests.
 * This step matches the phrasing without the "(iPhone X size)" suffix used in
 * the feature file.
 */
Given('the viewport width is set to 375px', async function (this: CustomWorld) {
  // Default iPhone X height – 812px – provides a realistic mobile viewport.
  await this.page!.setViewportSize({ width: 375, height: 812 });
});
