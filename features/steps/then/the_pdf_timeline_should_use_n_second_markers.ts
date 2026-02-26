import { Then } from "@cucumber/cucumber";
import assert from "node:assert";
import { CustomWorld } from "../../support/world";

Then('the PDF timeline should use {int} second markers', async function (this: CustomWorld, expectedSeconds: number) {
  await this.page!.waitForFunction(() => !!(window as any).__lastPDFDoc, { timeout: 10000 });
  const scale = await this.page!.evaluate(() => {
    const doc = (window as any).__lastPDFDoc;
    return doc.__test_scale;
  });

  assert.ok(scale, "No scale info found on PDF doc");
  assert.strictEqual(scale.secondsPerMarker, expectedSeconds, `Expected scale to use ${expectedSeconds}s markers, but found ${scale.secondsPerMarker}s`);
});
