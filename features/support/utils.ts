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
  const trigger = page.locator(`[data-testid="${triggerTestId}"]`);
  await waitForVisible(trigger);

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      // 1. Click the trigger
      await trigger.dispatchEvent('click');

      // Allow for animations and micro-tasks
      await advanceClock(page, 500);
      await page.waitForTimeout(100);

      // 2. Locate the popover that contains our target text
      const popoverSelector = '[role="listbox"], [role="menu"], .heroui-popover, [data-slot="content"]';
      const itemSelector = 'button, li, [role="option"], [role="menuitem"], .heroui-listbox-item';

      const popover = page.locator(popoverSelector).filter({
        visible: true,
        has: page.locator(itemSelector).filter({ hasText: itemText })
      }).first();

      // Wait for popover to be visible
      await waitForCondition(page, async () => await popover.isVisible(), 3000);

      // 3. Locate the item
      let targetItem = popover.locator(itemSelector).filter({ hasText: itemText, visible: true }).first();

      // Wait for the item to be visible
      await waitForVisible(targetItem, 3000);

      if (await targetItem.isVisible()) {
        await targetItem.dispatchEvent('click');
      } else {
        throw new Error(`Item "${itemText}" not visible after waiting`);
      }

      // 4. Wait for popover to hide
      await advanceClock(page, 500);
      await page.waitForTimeout(100);

      // Verify popover is gone (don't block if it takes a bit longer)
      await waitForHidden(popover, 2000).catch(() => {});

      return; // Success
    } catch (e) {
      if (attempt === 3) throw new Error(`Failed to select "${itemText}" from "${triggerTestId}": ${e}`);
      await page.mouse.click(0, 0); // Click away
      await advanceClock(page, 500);
      await page.waitForTimeout(100);
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
