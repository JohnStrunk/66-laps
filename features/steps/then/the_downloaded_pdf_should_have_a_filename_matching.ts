import { Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { expect } from '@playwright/test';
import { advanceClock } from "../../support/utils";

Then('the downloaded PDF should have a filename matching {string}', async function (this: CustomWorld, pattern: string) {
  // Wait for the filename to be set
  const start = Date.now();
  const timeout = 8000;
  let filename: string | null = null;

  while (Date.now() - start < timeout) {
    filename = await this.page!.evaluate(() => (window as unknown as { __lastDownloadName: string }).__lastDownloadName);
    if (filename) break;
    await advanceClock(this.page!, 500);
    await this.page!.waitForTimeout(100);
  }

  expect(filename, "No filename found from download").toBeTruthy();
  const regex = new RegExp(pattern);
  expect(regex.test(filename!), `Filename "${filename}" did not match pattern "${pattern}"`).toBeTruthy();
});
