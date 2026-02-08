import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { BASE_URL } from '../../support/utils';

Given('the app is loaded', async function (this: CustomWorld) {
  await this.page!.goto(`${BASE_URL}/app`);
  await this.page!.waitForSelector('[data-mounted="true"]', { timeout: 10000 });
  await this.page!.waitForSelector('[data-testid="lane-stack"]', { state: 'visible', timeout: 10000 });
});
