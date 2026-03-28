import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { BASE_URL, advanceClock } from '../../support/utils';

Given('the app is loaded', async function (this: CustomWorld) {
  const scenarioName = (this.scenarioName as string) || '';

  // If we are testing the first-launch setup dialog, don't use testMode
  const isFirstLaunchScenario = scenarioName.toLowerCase().includes('first launch');
  const url = isFirstLaunchScenario ? `${BASE_URL}/app` : `${BASE_URL}/app?testMode=true`;

  // Always reload the page to ensure fresh React state and store initialization.
  // Reusing the page object without a hard reload causes store/hydration desync
  // which prevents Next.js view transitions (like the start race button) from working.
  await this.page!.goto(url);
  await advanceClock(this.page!, 500);
  await this.page!.waitForSelector('[data-mounted="true"]', { timeout: 5000 });

  // Ensure test mode and setup dialog state are properly synchronized
  await this.page!.evaluate((isFirstLaunch) => {
      const store = ((window as unknown as import('../../support/store-type').TestWindow)).__bellLapStore;
      if (store) {
         store.getState().setSetupDialogOpen(isFirstLaunch);
      }
  }, isFirstLaunchScenario);
});
