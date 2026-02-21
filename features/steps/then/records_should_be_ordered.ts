import { Then } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';
import assert from 'node:assert';

Then('the records should be ordered chronologically with the most recent at the top', async function (this: CustomWorld) {
  const history = await this.page!.evaluate(() => {
    return (window as unknown as TestWindow).__bellLapStore.getState().history;
  });

  // Verify internal array order
  for (let i = 0; i < history.length - 1; i++) {
    assert.ok(history[i].startTime >= history[i + 1].startTime,
      `Record ${i} (${history[i].startTime}) should be >= Record ${i+1} (${history[i+1].startTime})`
    );
  }

  // Verify visual order (first card corresponds to first history item)
  const firstCard = await this.page!.locator('[data-testid="history-record"]').first();
  const firstCardText = await firstCard.textContent();
  const firstHistoryItem = history[0];
  assert.ok(firstCardText?.includes(firstHistoryItem.event),
    `First card should show "${firstHistoryItem.event}", got "${firstCardText}"`
  );
});
