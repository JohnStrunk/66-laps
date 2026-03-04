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
  // Wait for the element to be visible and stable
  await locator.first().waitFor({ state: 'visible' });

  // Try to scroll into view
  try {
    await locator.first().scrollIntoViewIfNeeded();
  } catch {
    // Ignore detachment
  }

  let box = await locator.first().boundingBox();
  if (!box) {
    // If it's gone, it might have re-rendered. Wait and try again once.
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
  const triggerContainer = page.locator(`[data-testid="${triggerTestId}"]`);
  await waitForVisible(triggerContainer);

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      // 1. Click the trigger
      // Many UI libraries use a button inside the container, or the container itself is clickable.
      // We try to find something clickable.
      const clickable = triggerContainer.locator('button, [role="combobox"], [role="button"], .heroui-select-trigger').first();

      if (await clickable.count() > 0) {
        await clickable.click({ force: true });
      } else {
        await triggerContainer.click({ force: true });
      }

      // Give it time to open
      for (let i = 0; i < 5; i++) {
        await advanceClock(page, 100);
        await page.waitForTimeout(10);
      }

      // 2. Identify the popover
      const popoverSelector = '[role="listbox"], [role="menu"], .heroui-popover, [data-slot="content"]';
      const popovers = page.locator(popoverSelector).filter({ visible: true });

      // Wait for at least one to be visible
      let popoverVisible = false;
      for (let i = 0; i < 20; i++) {
        if (await popovers.count() > 0) {
          popoverVisible = true;
          break;
        }
        await advanceClock(page, 100);
        await page.waitForTimeout(10);
      }

      if (!popoverVisible) continue;

      // HeroUI popovers might be shared or unique. We look for the one containing our text
      // across ALL visible popovers.
      let targetItem: Locator | null = null;
      const popoverCount = await popovers.count();

      for (let p = 0; p < popoverCount; p++) {
        const activePopover = popovers.nth(p);
        const itemLocator = activePopover.locator('button, li, [role="option"], [role="menuitem"], .heroui-listbox-item');
        const itemCount = await itemLocator.count();

        for (let i = 0; i < itemCount; i++) {
          const it = itemLocator.nth(i);
          const text = await it.textContent();
          const cleanedText = text?.trim() || "";
          if (cleanedText === itemText || cleanedText.includes(itemText)) {
            targetItem = it;
            break;
          }
        }
        if (targetItem) break;
      }

      if (!targetItem) {
        // Fallback: search by text globally if popover containment failed
        const globalItem = page.locator(popoverSelector).locator('button, li, [role="option"], [role="menuitem"], .heroui-listbox-item').filter({ hasText: itemText, visible: true }).first();
        if (await globalItem.count() > 0) {
          targetItem = globalItem;
        }
      }

      if (!targetItem) throw new Error(`Item "${itemText}" not found in any visible dropdown`);

      // 4. Click the item
      await targetItem.scrollIntoViewIfNeeded().catch(() => {});
      await targetItem.click({ force: true });

      // 5. Wait for popovers to hide
      for (let i = 0; i < 15; i++) {
        if (await popovers.count() === 0) break;
        await advanceClock(page, 200);
        await page.waitForTimeout(20);
      }

      await advanceClock(page, 300);
      return; // Success
    } catch (e) {
      if (attempt === 3) throw new Error(`Failed to select "${itemText}" from "${triggerTestId}": ${e}`);
      await page.mouse.click(0, 0); // Click away to close any stuck popover
      await advanceClock(page, 500);
      await page.waitForTimeout(50);
    }
  }
};

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

  await locator.first().waitFor({ state: 'visible', timeout: 5000 });
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
