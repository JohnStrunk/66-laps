import { Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { expect } from "@playwright/test";

Then('the seconds per marker should be {int}', function (this: CustomWorld, expectedMarker: number) {
    expect(this.pdfTimelineScale).toBeDefined();
    expect(this.pdfTimelineScale!.secondsPerMarker).toBe(expectedMarker);
});
