import { Then } from "@cucumber/cucumber";
import assert from "node:assert";
import { CustomWorld } from "../../support/world";

Then('the system share dialog should be opened with the PDF file', async function (this: CustomWorld) {
  // Wait for the share dialog data to be populated (async PDF generation)
  await this.page!.waitForFunction(() => !!(window as unknown as { __lastSharedData: unknown }).__lastSharedData, { timeout: 10000 });
  const fileInfo = await this.page!.evaluate(() => {
    const data = (window as unknown as { __lastSharedData: { files?: File[] } }).__lastSharedData;
    if (!data || !data.files || data.files.length === 0) return null;
    const file = data.files[0];
    return {
        name: file.name,
        type: file.type,
        size: file.size
    };
  });

  assert.ok(fileInfo, "No data shared");
  assert.strictEqual(fileInfo.type, 'application/pdf', "Shared file should be a PDF");
});
