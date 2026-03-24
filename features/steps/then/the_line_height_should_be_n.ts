import { Then } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";
import { expect } from "@playwright/test";

Then('the line height should be {float}', function (this: CustomWorld, expectedLineHeight: number) {
    expect(this.pdfTimelineScale).toBeDefined();
    // Use toBeCloseTo for floating point comparisons
    expect(this.pdfTimelineScale!.lineHeight).toBeCloseTo(expectedLineHeight, 3);
});
