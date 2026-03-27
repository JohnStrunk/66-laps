import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { BASE_URL, advanceClock } from '../../support/utils';

Given('the app is loaded', async function (this: CustomWorld) {
  const scenarioName = (this.scenarioName as string) || '';

  // If we are testing the first-launch setup dialog, don't use testMode
  const isFirstLaunchScenario = scenarioName.toLowerCase().includes('first launch');
  const url = isFirstLaunchScenario ? `${BASE_URL}/app` : `${BASE_URL}/app?testMode=true`;

  const currentUrl = this.page!.url();

  if (currentUrl === 'about:blank' || !currentUrl.includes('/app')) {
    await this.page!.goto(url);
    await advanceClock(this.page!, 500);
    await this.page!.waitForSelector('[data-mounted="true"]', { timeout: 5000 });
  } else {
    // We are already on the app page. Just ensure testMode is properly set in store if needed
    // The hooks.ts already cleared local storage and state.
    // TestMode isn't something we typically need to reset if we haven't actually navigated,
    // as it is passed via query param and doesn't get mutated by the app, but if we need
    // to bypass the setup modal:
    await this.page!.evaluate((isFirstLaunch) => {
        const store = ((window as unknown as import('../../support/store-type').TestWindow)).__bellLapStore;
        if (store) {
           store.getState().setSetupDialogOpen(isFirstLaunch);
        }
    }, isFirstLaunchScenario);

    // We might need to ensure the route matches our intent but for these tests, store state is usually enough.
    await this.page!.waitForSelector('[data-mounted="true"]', { timeout: 5000 });
  }

});
