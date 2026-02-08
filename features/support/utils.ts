import { Locator, Page } from 'playwright';
import { BellLapState } from '../../src/modules/bellLapStore';

export const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

export const getColorClass = (className: string | null): string | null => {
  if (!className) return null;
  return className.split(' ').find(c =>
    c.startsWith('text-') &&
    c !== 'text-lg' &&
    c !== 'font-black' &&
    c !== 'transition-colors'
  ) || null;
};

export const longPress = async (locator: Locator) => {
  const box = await locator.boundingBox();
  if (box) {
    await locator.page().mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await locator.page().mouse.down();
    await new Promise(r => setTimeout(r, 1200)); // Long press is 1s
    await locator.page().mouse.up();
  }
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
