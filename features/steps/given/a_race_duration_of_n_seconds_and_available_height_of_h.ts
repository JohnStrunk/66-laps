import { Given } from "@cucumber/cucumber";
import { CustomWorld } from "../../support/world";

Given('a race duration of {float} seconds and available height of {float}', function (this: CustomWorld, duration: number, height: number) {
    this.pdfDuration = duration;
    this.pdfHeight = height;
});
