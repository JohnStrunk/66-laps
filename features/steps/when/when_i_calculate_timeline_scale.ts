import { When } from "@cucumber/cucumber";
import { calculateTimelineScale } from "../../../src/modules/pdfGenerator";
import { CustomWorld } from "../../support/world";

When('I calculate the timeline scale', function (this: CustomWorld) {
    if (this.pdfDuration === undefined || this.pdfHeight === undefined) {
        throw new Error("Duration or height not set in context.");
    }
    this.pdfTimelineScale = calculateTimelineScale(this.pdfDuration, this.pdfHeight);
});
