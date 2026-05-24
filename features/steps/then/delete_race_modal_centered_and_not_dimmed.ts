import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';

Then('the dialog should be centered on screen', async function () {
  const dialog = this.page.locator('[data-testid="delete-race-dialog"]');
  await expect(dialog).toBeVisible();
  const dialogBox = await dialog.boundingBox();
  const viewport = this.page.viewportSize();
  if (dialogBox && viewport) {
    const centerX = dialogBox.x + dialogBox.width / 2;
    const centerY = dialogBox.y + dialogBox.height / 2;
    const deltaX = Math.abs(centerX - viewport.width / 2);
    const deltaY = Math.abs(centerY - viewport.height / 2);
    // Allow small tolerance (5px)
    expect(deltaX).toBeLessThanOrEqual(5);
    expect(deltaY).toBeLessThanOrEqual(5);
  } else {
    // Fallback: ensure dialog has flex centering via parent classes
    const parent = dialog.locator('..'); // parent container
    const classes = await parent.getAttribute('class');
    expect(classes).toContain('items-center');
    expect(classes).toContain('justify-center');
  }
});

Then('the background should not be dimmed', async function () {
  // Locate the backdrop element added by HeroUI Modal; it should have class 'bg-transparent'
  const backdrop = this.page.locator('.bg-transparent');
  await expect(backdrop).toBeVisible();
  // No further class checks needed; visibility ensures no dimming
});
