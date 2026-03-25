import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { expect } from '@playwright/test';
import { TestWindow } from '../../support/store-type';

Given('I am viewing the help instructions', async function (this: CustomWorld) {
  // Navigate to main menu and tap help, or set view directly
  await this.page!.evaluate(() => {
    (window as unknown as TestWindow).__bellLapStore.getState().setView('help');
  });

  const view = await this.page!.evaluate(() => {
    return (window as unknown as TestWindow).__bellLapStore.getState().view;
  });

  expect(view).toBe('help');
});
