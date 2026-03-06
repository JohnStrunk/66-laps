import { Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { expect } from '@playwright/test';
import { advanceClock } from "../../support/utils";

Then('the system share dialog should be opened with the PDF file', async function (this: CustomWorld) {
  // Wait for the share dialog data to be populated (async PDF generation)
  const start = Date.now();
  const timeout = 8000;
  let dataFound = false;

  while (Date.now() - start < timeout) {
    dataFound = await this.page!.evaluate(() => !!(window as unknown as { __lastSharedData: unknown }).__lastSharedData);
    if (dataFound) break;
    await advanceClock(this.page!, 500);
    await this.page!.waitForTimeout(100);
  }

  expect(dataFound, "Timed out waiting for share data").toBe(true);

  const shareData = await this.page!.evaluate(() => {
    const data = (window as unknown as { __lastSharedData: { files?: File[], title?: string, text?: string } }).__lastSharedData;
    if (!data) return null;
    const file = data.files ? data.files[0] : null;
    return {
        title: data.title,
        text: data.text,
        file: file ? {
            name: file.name,
            type: file.type,
            size: file.size
        } : null
    };
  });

  expect(shareData, "No data shared").toBeTruthy();
  expect(shareData!.file, "No file shared").toBeTruthy();
  expect(shareData!.file!.type, "Shared file should be a PDF").toBe('application/pdf');

  // Verify the title and text match the template
  expect(shareData!.title).toMatch(/^Race result - .+ E:\d+ H:\d+$/);
  expect(shareData!.text).toMatch(/^Race result for .+ E:\d+ H:\d+ on \d{1,2}\/\d{1,2}\/\d{2,4}\nhttps:\/\/66-laps\.com$/);
});
