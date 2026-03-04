import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';

Then(`the background of Zone A for Lane {int} should follow the theme`, async function (this: CustomWorld, laneNumber: number) {
  const laneRow = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"]`);
  const zoneA = laneRow.locator('[data-testid="lane-zone-a"]');

  await expect(zoneA).toBeVisible();

  // Get computed background color of the Card and Zone A
  const colors = await this.page!.evaluate((args) => {
    const card = document.querySelector(`[data-testid="lane-row"][data-lane-number="${args.laneNumber}"]`);
    const zone = card?.querySelector('[data-testid="lane-zone-a"]');
    if (!card || !zone) return null;

    return {
      cardBg: window.getComputedStyle(card).backgroundColor,
      zoneBg: window.getComputedStyle(zone).backgroundColor
    };
  }, { laneNumber });

  expect(colors, 'Could not retrieve background colors').toBeTruthy();
  const isTransparent = colors!.zoneBg === 'rgba(0, 0, 0, 0)' || colors!.zoneBg === 'transparent';
  const matchesCard = colors!.zoneBg === colors!.cardBg;
  expect(isTransparent || matchesCard, `Zone A background (${colors!.zoneBg}) should be transparent or match Card background (${colors!.cardBg})`).toBeTruthy();
});
