import { Given } from '@cucumber/cucumber';
import assert from 'node:assert';
import { CustomWorld } from '../../support/world';
import { BASE_URL } from '../../support/utils';

Given('all lanes are initially active with a lap count of {int}', async function (this: CustomWorld, initialCount: number) {
  if (this.page!.url() === 'about:blank' || !this.page!.url().includes('/app')) {
    await this.page!.goto(`${BASE_URL}/app?testMode=true`);
    await this.page!.waitForSelector('[data-mounted="true"]', { timeout: 10000 });
    await this.page!.waitForSelector('[data-testid="lane-row"]');
  }

  const counts = await this.page!.$$eval('[data-testid="lane-count"]', (els) => els.map(e => parseInt(e.textContent || '0', 10)));
  const allMatch = counts.every(c => c === initialCount);
  assert.ok(allMatch, `Not all lanes have count ${initialCount}. Found: ${counts}`);
});
