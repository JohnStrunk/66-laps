import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";

Given('the browser is ready for PDF actions', async function (this: CustomWorld) {
  await this.page!.addInitScript(() => {
    // Mock URL.createObjectURL
    window.URL.createObjectURL = () => 'data:application/pdf;base64,mock-pdf-data';

    // Mock getBase64Image to be immediate
    // @ts-expect-error - overriding for tests
    window.getBase64Image = async () => 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==';
  });

  await this.page!.evaluate(async () => {
    window.URL.createObjectURL = () => 'data:application/pdf;base64,mock-pdf-data';

    // Smoke test jsPDF if available
    // @ts-expect-error - jsPDF might be on window or imported
    if (window.jsPDF) {
        console.log('jsPDF is available');
    }
  });
});
