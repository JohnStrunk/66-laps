import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { waitForVisible } from '../../support/utils';

Then('the {string} dialog should be vertically centered', async function (this: CustomWorld, dialogName: string) {
  // Only supports New Race Setup dialog currently
  const testId = dialogName.toLowerCase().replace(/\s+/g, '-') + '-dialog';
  const locator = this.page!.locator(`[data-testid="${testId}"]`);
  await waitForVisible(locator);
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error(`Could not get bounding box for ${dialogName} dialog`);
  }
  const viewport = this.page!.viewportSize();
  if (!viewport) {
    throw new Error('Viewport size unavailable');
  }
  const expectedTop = (viewport.height - box.height) / 2;
  const diff = Math.abs(box.y - expectedTop);
  const tolerance = 5; // pixels
  if (diff > tolerance) {
    throw new Error(`Dialog not vertically centered: top offset ${box.y}px, expected ${expectedTop}px (diff ${diff}px)`);
  }
});
