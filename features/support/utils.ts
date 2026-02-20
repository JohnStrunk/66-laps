import { Locator, Page } from 'playwright';
import { BellLapState } from '../../src/modules/bellLapStore';
import { TestWindow } from './store-type';

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

  // Click trigger, with retry if popover doesn't appear
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      await trigger.click({ force: true });
      // Wait for animation
      await page.waitForTimeout(500);
    } catch (e) {
      if (attempt === 2) throw e;
      continue;
    }

    const popover = page.locator('[role="menu"], [role="listbox"]').filter({
      has: page.locator('button, li, [role="menuitem"], [role="option"]').getByText(itemText, { exact: true })
    }).last();

    try {
      await popover.waitFor({ state: 'visible', timeout: 2000 });
      const item = popover.locator('button, li, [role="menuitem"], [role="option"]').getByText(itemText, { exact: true });
      await item.click({ force: true });
      break; // Success
    } catch (e) {
      // Click elsewhere to close any stuck popover and try again
      await page.mouse.click(0, 0);
      await page.waitForTimeout(500);
      if (attempt === 2) throw e;
    }
  }

  // Wait for the trigger text to update
  await page.waitForFunction(({ testId, expected }) => {
    const trigger = document.querySelector(`[data-testid="${testId}"]`);
    const text = trigger?.textContent?.trim() || "";
    return text.includes(expected);
  }, { testId: triggerTestId, expected: itemText }, { timeout: 3000 }).catch(() => {});
};

export const selectEvent = async (page: Page, eventName: string) => {
  await selectDropdownItem(page, 'event-dropdown-trigger', eventName);

  // Additional wait for store state
  await page.waitForFunction((expected) => {
    const store = (window as unknown as TestWindow).__bellLapStore?.getState();
    return store?.event === expected;
  }, eventName, { timeout: 3000 }).catch(() => {});
};

export const getStoreState = async (page: Page): Promise<BellLapState> => {
  return await page.evaluate(() => (window as unknown as { __bellLapStore: { getState: () => BellLapState } }).__bellLapStore.getState());
};
