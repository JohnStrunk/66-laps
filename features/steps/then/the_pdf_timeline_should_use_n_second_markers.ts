import { Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { expect } from '@playwright/test';

Then('the PDF timeline should use {int} second markers', async function (this: CustomWorld, expectedSeconds: number) {
  await this.page!.waitForFunction(() => !!(window as unknown as { __lastPDFDoc: unknown }).__lastPDFDoc, { timeout: 10000 });
  const scale = await this.page!.evaluate(() => {
    const doc = (window as unknown as { __lastPDFDoc: { __test_scale: { secondsPerMarker: number } } }).__lastPDFDoc;
    return doc.__test_scale;
  });

  expect(scale, "No scale info found on PDF doc").toBeTruthy();
  expect(scale.secondsPerMarker, `Expected scale to use ${expectedSeconds}s markers, but found ${scale.secondsPerMarker}s`).toBe(expectedSeconds);
});
