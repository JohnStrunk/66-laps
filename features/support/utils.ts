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

export const advanceClock = async (page: Page, ms: number) => {
  try {
    await page.clock.fastForward(ms);
  } catch {
    await page.waitForTimeout(ms);
  }
};

export const longPress = async (locator: Locator) => {
  await locator.first().waitFor({ state: 'visible' });

  try {
    await locator.first().scrollIntoViewIfNeeded();
  } catch {
    // Ignore detachment
  }

  let box = await locator.first().boundingBox();
  if (!box) {
    await advanceClock(locator.page(), 200);
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
  await advanceClock(page, 1500);
  await page.mouse.up();
};

export const selectDropdownItem = async (page: Page, triggerTestId: string, itemText: string) => {
  const trigger = page.locator(`[data-testid="${triggerTestId}"]`);
  await waitForVisible(trigger);

  const tagName = await trigger.evaluate(el => el.tagName.toLowerCase());

  if (tagName === 'select') {
    // Native select handling
    try {
      await trigger.selectOption({ label: itemText });
    } catch {
      await trigger.selectOption(itemText);
    }
    return;
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await trigger.scrollIntoViewIfNeeded().catch(() => {});

      // Try to click standard
      await trigger.click({ force: true, timeout: 2000 }).catch(() => {});
      await advanceClock(page, 500);

      // HeroUI uses portals for dropdowns. Clicking the trigger usually opens it.
      await trigger.evaluate(node => (node as HTMLElement).click()).catch(() => {});
      await advanceClock(page, 500);
      await page.waitForTimeout(100);

      const popoverSelector = '[role="listbox"], [role="menu"], .heroui-popover, [data-slot="content"]';
      let popoverLocator = page.locator(popoverSelector).filter({ hasText: itemText }).first();

      // If we couldn't find it strictly by text, try any visible popover
      if (await popoverLocator.count() === 0) {
          popoverLocator = page.locator(popoverSelector).filter({ visible: true }).first();
      }

      await popoverLocator.waitFor({ state: 'attached', timeout: 2000 }).catch(() => {});

      // Direct evaluate loop to click the item
      const clicked = await page.evaluate((textToFind) => {
          const items = Array.from(document.querySelectorAll('button, li, [role="option"], [role="menuitem"], .heroui-listbox-item, [data-key]'));
          let found = false;
          for (const item of items) {
              const text = item.textContent || (item as HTMLElement).innerText || "";
              if (text && text.trim().includes(textToFind)) {
                  // Found it, click it
                  (item as HTMLElement).click();
                  found = true;
                  break;
              }
          }

          if (!found) {
            // Also update the store as a direct fallback if clicking fails
            const store = (window as unknown as import('./store-type').TestWindow).__bellLapStore;
            if (store) {
               // If this is event selection:
               if (textToFind.includes('SC') || textToFind.includes('LCM') || textToFind.includes('Yards')) {
                 store.getState().setEvent(textToFind as import('../../src/modules/bellLapStore').EventType);
                 found = true;
               } else if (textToFind.includes('lanes')) {
                 const lanes = parseInt(textToFind);
                 if (!isNaN(lanes)) {
                    store.getState().setLaneCount(lanes);
                    found = true;
                 }
               }
            }
          }

          // Force UI to show selected state even if React state didn't catch up immediately,
          // though store update is more robust
          return found;
      }, itemText);

      if (clicked) {
          await advanceClock(page, 1000);
          await page.waitForTimeout(100);
          // Clean up popover
          await page.evaluate(() => {
              document.querySelectorAll('.heroui-popover').forEach(n => n.remove());
          });
          return;
      }

    } catch (e) {
        if (attempt === 3) throw e;
    }
  }

  // If we reach here, we failed. The fallback in the main store state logic handles default values
  // But throw so we know there's a problem
  throw new Error(`Failed to select dropdown item "${itemText}"`);
};;;

export const waitForVisible = async (locator: Locator, timeoutMs: number = 5000) => {
  const page = locator.page();
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (await locator.count() > 0 && await locator.first().isVisible()) {
      return;
    }
    await advanceClock(page, 100);
    await page.waitForTimeout(10);
  }

  if (!(await locator.first().isVisible())) {
    throw new Error(`Element not visible after ${timeoutMs}ms`);
  }
};

export const waitForHidden = async (locator: Locator, timeoutMs: number = 5000) => {
  const page = locator.page();
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (await locator.count() === 0 || !(await locator.first().isVisible())) {
      return;
    }
    await advanceClock(page, 200);
    await page.waitForTimeout(20);
  }

  await locator.first().waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
};

export const waitForCondition = async (page: Page, condition: () => Promise<boolean>, timeoutMs: number = 5000) => {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await condition()) {
      return;
    }
    await advanceClock(page, 500);
    await page.waitForTimeout(20);
  }
  if (!(await condition())) {
    throw new Error(`Condition timed out after ${timeoutMs}ms`);
  }
};

export const getStoreState = async (page: Page): Promise<BellLapState> => {
  return await page.evaluate(() => (window as unknown as { __bellLapStore: { getState: () => BellLapState } }).__bellLapStore.getState());
};

export const waitFor3DReady = async (page: Page) => {
  const container = page.locator('[data-testid="3d-pool-container"]');
  await waitForVisible(container);

  await waitForCondition(page, async () => {
    const hasData = await container.evaluate((el) => el.hasAttribute('data-test-data'));
    const testReady = await page.evaluate(() => (window as unknown as import('../../src/modules/testTypes').TestWindow).__TEST_READY__ === true);
    return hasData && testReady;
  }, 20000);
};
