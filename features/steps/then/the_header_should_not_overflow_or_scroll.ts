import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then('the header should not overflow or scroll', async function (this: CustomWorld) {
  const header = this.page!.locator('[data-testid="bell-lap-header"]');
  await expect(header).toBeVisible();

  const check = await header.evaluate((el) => {
    // Check if any element inside the header is wider than the header itself
    // or if the header's scrollWidth is greater than its clientWidth.
    const scrollWidth = el.scrollWidth;
    const clientWidth = el.clientWidth;
    const hasHorizontalScroll = scrollWidth > clientWidth;

    // Also check the specific leaderboard row which has overflow-x-auto
    const leaderboard = el.querySelector('[data-testid="live-leaderboard"]');
    let leaderboardScrolls = false;
    if (leaderboard) {
      leaderboardScrolls = leaderboard.scrollWidth > leaderboard.clientWidth;
    }

    return {
      hasHorizontalScroll,
      leaderboardScrolls,
      scrollWidth,
      clientWidth
    };
  });

  expect(check.hasHorizontalScroll, `Header has horizontal scroll (scrollWidth: ${check.scrollWidth}px vs clientWidth: ${check.clientWidth}px)`).toBe(false);
  expect(check.leaderboardScrolls, `Leaderboard row has horizontal scroll`).toBe(false);
});
