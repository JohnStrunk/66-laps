import { Locator, Page } from 'playwright';
import { BellLapState } from '../../src/modules/bellLapStore';

export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export const getColorClass = (className: string | null): string | null => {
  if (!className) return null;
  return className.split(' ').find(c =>
    c.startsWith('text-') &&
    !c.match(/^text-(xs|sm|base|lg|xl|[2-9]xl|\[.*\])$/) &&
    !c.match(/^sm:text-.*$/) &&
    c !== 'font-black' &&
    c !== 'transition-colors'
  ) || null;
};

export const longPress = async (locator: Locator) => {
  // Wait for the element to be visible and stable
  await locator.first().waitFor({ state: 'visible' });

  // Try to scroll into view, but don't fail if it detaches - we will retry getting bounding box
  try {
    await locator.first().scrollIntoViewIfNeeded();
  } catch {
    // Ignore detachment here, we'll handle it below
  }

  let box = await locator.first().boundingBox();
  if (!box) {
    // If it's gone, it might have re-rendered. Wait and try again once.
    await new Promise(r => setTimeout(r, 200));
    await locator.first().waitFor({ state: 'visible' });
    box = await locator.first().boundingBox();
  }

  if (!box) {
    throw new Error(`Element is visible but has no bounding box (detached or hidden)`);
  }

  await performPress(locator.page(), box);
};

const performPress = async (page: Page, box: { x: number; y: number; width: number; height: number }) => {
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  try {
    // Advance clock if it's installed
    await page.clock.fastForward(1500); // Increased from 1200 for safety
  } catch {
    // Fallback for real time if clock is not installed
    await new Promise(r => setTimeout(r, 1500));
  }
  await page.mouse.up();
};

export const selectDropdownItem = async (page: Page, triggerTestId: string, itemText: string) => {
  const trigger = page.locator(`[data-testid="${triggerTestId}"]`);
  await trigger.waitFor({ state: 'visible' });

  // Define the item locator with a visibility filter to avoid old popovers
  const itemLocator = page.locator('[role="menu"], [role="listbox"], .heroui-popover')
    .locator('button, li, [role="menuitem"], [role="option"], .heroui-listbox-item')
    .getByText(itemText, { exact: false })
    .filter({ visible: true });

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      // Click the trigger to open the dropdown
      await trigger.click({ force: true });

      // Wait for the item to be visible and ready for interaction
      await itemLocator.first().waitFor({ state: 'visible', timeout: 3000 });

      // Click the item
      await itemLocator.first().click({ force: true });

      // Wait for the dropdown to close (item becomes hidden)
      await itemLocator.first().waitFor({ state: 'hidden', timeout: 3000 });

      // Brief wait for any state transitions to settle
      await page.waitForTimeout(200);
      return; // Success
    } catch (e) {
      if (attempt === 3) throw new Error(`Failed to select "${itemText}" from "${triggerTestId}": ${e}`);

      // Try to reset by clicking elsewhere and waiting
      await page.mouse.click(0, 0);
      await page.waitForTimeout(500);
    }
  }
};

export const getStoreState = async (page: Page): Promise<BellLapState> => {
  return await page.evaluate(() => (window as unknown as { __bellLapStore: { getState: () => BellLapState } }).__bellLapStore.getState());
};
