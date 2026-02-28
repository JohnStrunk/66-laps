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

  // Wait for trigger to be visible, potentially advancing clock if it's in a modal animation
  await waitForVisible(trigger);

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      // Click the trigger to open the dropdown
      await trigger.click({ force: true });

      // Wait for the popover/listbox to appear
      const popoverSelector = '[role="listbox"], [role="menu"], .heroui-popover, [data-slot="content"]';
      const popover = page.locator(popoverSelector).filter({ visible: true });

      let popoverVisible = false;
      for (let i = 0; i < 10; i++) {
        await advanceClock(page, 100);
        if (await popover.count() > 0 && await popover.first().isVisible()) {
          popoverVisible = true;
          break;
        }
      }

      if (!popoverVisible) {
        await trigger.click({ force: true });
        await advanceClock(page, 500);
      }

      await popover.first().waitFor({ state: 'visible', timeout: 3000 });

      // Find the item within the visible popover
      const item = popover.first().locator('button, li, [role="option"], [role="menuitem"], .heroui-listbox-item')
        .filter({ hasText: itemText })
        .filter({ visible: true })
        .first();

      await item.waitFor({ state: 'visible', timeout: 3000 });

      // Click the item
      await item.click({ force: true });

      // Advance clock in ticks until the popover is hidden
      for (let i = 0; i < 20; i++) {
        if (!(await popover.first().isVisible())) break;
        await advanceClock(page, 200);
      }

      // Final wait for it to be fully hidden
      await popover.first().waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});

      await advanceClock(page, 200);
      return; // Success
    } catch (e) {
      if (attempt === 3) throw new Error(`Failed to select "${itemText}" from "${triggerTestId}": ${e}`);

      // Try to reset by clicking elsewhere
      await page.mouse.click(0, 0);
      await advanceClock(page, 500);
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
  }

  // Final attempt with standard waitFor to get a good error message if it still fails
  await locator.first().waitFor({ state: 'visible', timeout: 1000 });
};

export const waitForHidden = async (locator: Locator, timeoutMs: number = 5000) => {
  const page = locator.page();
  const start = Date.now();

  while (Date.now() - start < timeoutMs) {
    if (await locator.count() === 0 || !(await locator.first().isVisible())) {
      return;
    }
    await advanceClock(page, 200);
  }

  // Final attempt with standard waitFor to get a good error message if it still fails
  await locator.first().waitFor({ state: 'hidden', timeout: 1000 }).catch(() => {});
};

export const getStoreState = async (page: Page): Promise<BellLapState> => {
  return await page.evaluate(() => (window as unknown as { __bellLapStore: { getState: () => BellLapState } }).__bellLapStore.getState());
};
