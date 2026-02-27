import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { BASE_URL, advanceClock } from '../../support/utils';

Given('the app is loaded', async function (this: CustomWorld) {
  const scenarioName = (this.scenarioName as string) || '';

  // If we are testing the first-launch setup dialog, don't use testMode
  const isFirstLaunchScenario = scenarioName.toLowerCase().includes('first launch');
  const url = isFirstLaunchScenario ? `${BASE_URL}/app` : `${BASE_URL}/app?testMode=true`;

  await this.page!.goto(url);
  await advanceClock(this.page!, 500);
  await this.page!.waitForSelector('[data-mounted="true"]', { timeout: 15000 });
});
