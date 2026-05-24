import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';

Given('the viewport width is set to {int}px (iPhone X size)', async function (this: CustomWorld, width: number) {
  // Set height to iPhone X height (812px) for consistency.
  await this.page!.setViewportSize({ width, height: 812 });
});
