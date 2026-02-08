import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';

Then('any disabled lanes should be re-enabled', async function (this: CustomWorld) {
  const allActive = await this.page!.evaluate(() => {
    return (window as unknown as TestWindow).__bellLapStore.getState().lanes.every((l) => !l.isEmpty);
  });
  assert.ok(allActive, 'All lanes should be re-enabled after reset');
  const emptyText = await this.page!.locator('text="EMPTY"').count();
  assert.strictEqual(emptyText, 0);
});
