import { Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { expect } from '@playwright/test';

Then('the downloaded PDF should have a filename matching {string}', async function (this: CustomWorld, pattern: string) {
  // Wait for the filename to be set
  await this.page!.waitForFunction(() => !!(window as unknown as { __lastDownloadName: string }).__lastDownloadName, { timeout: 10000 });
  const filename = await this.page!.evaluate(() => (window as unknown as { __lastDownloadName: string }).__lastDownloadName);
  expect(filename, "No filename found from download").toBeTruthy();
  const regex = new RegExp(pattern);
  expect(regex.test(filename), `Filename "${filename}" did not match pattern "${pattern}"`).toBeTruthy();
});
