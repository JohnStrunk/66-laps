import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

// Verify that each history record shows the event and timestamp on a single line
Then('each history record shows the race event and start time on the same line', async function (this: CustomWorld) {
  if (!this.page) {
    throw new Error('Page not initialized');
  }
  const records = this.page.locator('[data-testid="history-record-info"]');
  const count = await records.count();
  for (let i = 0; i < count; i++) {
    const record = records.nth(i);
    const text = await record.textContent() || '';
    // Ensure no newline characters (single line)
    expect(text).not.toContain('\n');
    // Verify height does not exceed line-height (approx.)
    const lineHeight = await this.page.evaluate((el) => {
      if (!el) return 0;
      const style = window.getComputedStyle(el);
      return parseFloat(style.lineHeight);
    }, await record.elementHandle());
    const bounding = await record.boundingBox();
    const height = bounding?.height ?? 0;
    expect(height).toBeLessThanOrEqual(lineHeight + 2);
  }
});

// Verify overflow truncation with ellipsis
Then('any overflow text is truncated with an ellipsis', async function (this: CustomWorld) {
  if (!this.page) {
    throw new Error('Page not initialized');
  }
  const records = this.page.locator('[data-testid="history-record-info"]');
  const count = await records.count();
  for (let i = 0; i < count; i++) {
    const record = records.nth(i);
    const overflow = await this.page.evaluate((el) => {
      if (!el) return '';
      return window.getComputedStyle(el).textOverflow;
    }, await record.elementHandle());
    expect(overflow).toBe('ellipsis');
  }
});

// Verify title attribute contains full event and timestamp
Then('the full event and timestamp are available via the element\'s title attribute', async function (this: CustomWorld) {
  if (!this.page) {
    throw new Error('Page not initialized');
  }
  const records = this.page.locator('[data-testid="history-record-info"]');
  const count = await records.count();
  for (let i = 0; i < count; i++) {
    const record = records.nth(i);
    const title = await record.getAttribute('title');
    expect(title).toBeTruthy();
    // Simple sanity check: title should contain a space separating event and date
    expect(title).toContain(' ');
  }
});
