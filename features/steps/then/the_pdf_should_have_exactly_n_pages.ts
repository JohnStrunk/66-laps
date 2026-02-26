import { Then } from "@cucumber/cucumber";
import assert from "node:assert";
import { CustomWorld } from "../../support/world";

Then('the PDF should have exactly {int} page', async function (this: CustomWorld, expectedPages: number) {
  await this.page!.waitForFunction(() => !!(window as unknown as { __lastPDFDoc: unknown }).__lastPDFDoc, { timeout: 10000 });
  const pageCount = await this.page!.evaluate(() => {
    const doc = (window as unknown as { __lastPDFDoc: { internal: { getNumberOfPages: () => number } } }).__lastPDFDoc;
    // jsPDF internal API to get page count
    return doc.internal.getNumberOfPages();
  });

  assert.strictEqual(pageCount, expectedPages, `Expected PDF to have ${expectedPages} page(s), but found ${pageCount}`);
});
