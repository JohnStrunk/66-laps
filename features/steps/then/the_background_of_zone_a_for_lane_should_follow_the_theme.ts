import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then(`the background of Zone A for Lane {int} should follow the theme`, async function (this: CustomWorld, laneNumber: number) {
  const laneRow = this.page!.locator(`[data-testid="lane-row"][data-lane-number="${laneNumber}"]`);
  const zoneA = laneRow.locator('[data-testid="lane-zone-a"]');

  await zoneA.waitFor({ state: 'visible' });

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

  assert.ok(colors, 'Could not retrieve background colors');
  const isTransparent = colors.zoneBg === 'rgba(0, 0, 0, 0)' || colors.zoneBg === 'transparent';
  const matchesCard = colors.zoneBg === colors.cardBg;
  assert.ok(isTransparent || matchesCard, `Zone A background (${colors.zoneBg}) should be transparent or match Card background (${colors.cardBg})`);
});
