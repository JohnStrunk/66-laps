import { Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';

Then(`each lane's Zone A should display the current lap count prominently`, async function (this: CustomWorld) {
  const zoneAs = await this.page!.$$('[data-testid="lane-zone-a"]');
  for (const zoneA of zoneAs) {
    const isVisible = await zoneA.isVisible();
    if (isVisible) {
      const lapCount = await zoneA.$('[data-testid="lane-count"]');
      assert.ok(lapCount, 'Zone A should contain lap count element');
      const classes = await lapCount.getAttribute('class');
      assert.ok(classes?.includes('text-xl') && classes?.includes('sm:text-3xl'), 'Lap count should be prominent (text-xl sm:text-3xl)');
    }
  }
});
