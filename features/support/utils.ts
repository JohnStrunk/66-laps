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
      await trigger.click({ force: true });

      // Only advance clock minimally, HeroUI popovers animate in quickly
      await advanceClock(page, 100);
      await page.waitForTimeout(10);

      const popoverSelector = '[role="listbox"], [role="menu"], .heroui-popover, [data-slot="content"]';
      const itemSelector = 'button, li, [role="option"], [role="menuitem"], .heroui-listbox-item';

      const popoverLocator = page.locator(popoverSelector).filter({ visible: true }).first();
      const itemLocator = popoverLocator.locator(itemSelector);

      // Use exact text match pattern to avoid substring matching issues (e.g. 500 matching 1500)
      const targetItem = itemLocator.filter({ hasText: new RegExp(`^\\s*${itemText.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}\\s*$`, 'i') }).first();

      try {
        await targetItem.waitFor({ state: 'attached', timeout: 200 });
        await targetItem.click({ force: true });
        // Ensure dropdown is closed
        await page.keyboard.press('Escape');
      } catch {
        const allItems = await itemLocator.all();
        let found = false;
        for (const it of allItems) {
          const text = await it.textContent();
          if (text?.trim() === itemText) {
            await it.click({ force: true });
            // Ensure dropdown is closed
            await page.keyboard.press('Escape');
            found = true;
            break;
          }
        }
        if (!found) throw new Error(`Item "${itemText}" not found`);
      }

      await advanceClock(page, 500);
      await page.waitForTimeout(100);
      return;
    } catch (e) {
      if (attempt === 3) throw new Error(`Failed to select "${itemText}" from "${triggerTestId}": ${e}`);
      await page.mouse.click(0, 0);
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
