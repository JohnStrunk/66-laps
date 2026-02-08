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
  // Try to find the element and ensure it's attached
  await locator.waitFor({ state: 'attached' });
  await locator.scrollIntoViewIfNeeded();

  // Re-verify it's still there after scroll
  if (await locator.count() === 0) {
     // If it's gone, it might have re-rendered. locator will re-find if we wait for it.
     await locator.waitFor({ state: 'visible' });
  }

  const box = await locator.boundingBox();
  if (!box) {
    // If we still can't get it, wait a tiny bit and try one last time
    await new Promise(r => setTimeout(r, 200));
    const boxRetry = await locator.boundingBox();
    if (!boxRetry) {
       throw new Error(`Element is visible but has no bounding box (detached or hidden)`);
    }
    await performPress(locator.page(), boxRetry);
    return;
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

export const selectEvent = async (page: Page, eventName: string) => {
  const header = page.locator('[data-testid="bell-lap-header"]');
  const dropdown = header.locator('button:has-text("SC"), button:has-text("LC")').first();
  await dropdown.click();
  const popover = page.locator('[role="menu"], [role="listbox"], .z-50').last();
  await popover.waitFor({ state: 'visible' });
  const item = popover.locator('button, li, [role="menuitem"], [role="option"]').getByText(eventName, { exact: true });
  await item.click({ force: true });
};

export const getStoreState = async (page: Page): Promise<BellLapState> => {
  return await page.evaluate(() => (window as unknown as { __bellLapStore: { getState: () => BellLapState } }).__bellLapStore.getState());
};
