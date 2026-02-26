import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";

Given('the browser is ready for PDF actions', async function (this: CustomWorld) {
  // Most mocks are now unnecessary because of how pdfGenerator.ts handles testMode.
  // But we still mock URL.createObjectURL to avoid console errors when trying to load local resources.
  await this.page!.evaluate(() => {
    window.URL.createObjectURL = () => 'blob:mock-pdf';
  });
});
