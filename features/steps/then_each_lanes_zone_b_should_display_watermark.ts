import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../support/world';

Then(`each lane's Zone B should display its corresponding lane number as a watermark`, async function (this: CustomWorld) {
  const rows = await this.page!.$$('[data-testid="lane-row"]');
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const laneNumber = i + 1;
    const zoneB = await row.$('[data-testid="lane-zone-b"]');
    const text = await zoneB?.textContent();
    assert.ok(text?.includes(laneNumber.toString()), `Lane ${laneNumber} watermark not found in ${text}`);
  }
});
