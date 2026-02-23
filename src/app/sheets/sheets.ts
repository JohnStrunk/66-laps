export type SheetLinks = Record<string, string>;

export type ExternalSheet =
    | { all: SheetLinks }
    | { SC: SheetLinks; LC: SheetLinks };

export const externalSheets: Record<string, ExternalSheet> = {
    "USA Swimming": {
        SC: {
            "500": "https://websitedevsa.blob.core.windows.net/sitefinity/docs/default-source/officialsdocuments/officiating-forms/split-recording-forms/500-yard-freestyle-split-recording-sheet.pdf",
            "1000": "https://websitedevsa.blob.core.windows.net/sitefinity/docs/default-source/officialsdocuments/officiating-forms/split-recording-forms/1000-yard-freestyle-split-recording-sheet.pdf",
            "1650": "https://websitedevsa.blob.core.windows.net/sitefinity/docs/default-source/officialsdocuments/officiating-forms/split-recording-forms/1650-yard-freestyle-split-recording-sheet.pdf",
        },
        LC: {
            "800": "https://websitedevsa.blob.core.windows.net/sitefinity/docs/default-source/officialsdocuments/officiating-forms/split-recording-forms/800-free-lcb91036fa6cbc6a0a9b57ff00009030c2.pdf",
            "1500": "https://websitedevsa.blob.core.windows.net/sitefinity/docs/default-source/officialsdocuments/officiating-forms/split-recording-forms/1500-meter-freestyle-lc-split-recording-sheet.pdf",
        },
    },
    "Alaska": {
        // https://www.gomotionapp.com/team/wzaslsc/page/governance/officials-corner
        SC: {
            "500": "https://www.teamunify.com/wzaslsc/__doc__/500lap.pdf",
            "1000": "https://www.teamunify.com/wzaslsc/__doc__/1000lap.pdf",
            "1650": "https://www.teamunify.com/wzaslsc/__doc__/1650lap.pdf",
        },
        LC: {
            "800": "https://www.teamunify.com/wzaslsc/__doc__/800lap.pdf",
            "1500": "https://www.teamunify.com/wzaslsc/__doc__/1500lap.pdf",
        },
    },
    "Arizona Swimming": {  // https://www.azswimming.org/document-library/
        SC: {
            "500": "https://www.azswimming.org/wp-content/uploads/2016/05/500-yards-counting-sheet.pdf",
            "1000": "https://www.azswimming.org/wp-content/uploads/2016/05/1000-Yards-Counting-Sheet.pdf",
            "1650": "https://www.azswimming.org/wp-content/uploads/2016/05/1650-Yards-Counting-Sheet.pdf",
        },
        LC: {
            "800": "https://www.azswimming.org/wp-content/uploads/2016/05/800-Meter-Free-Counting-Sheet.pdf",
            "1500": "https://www.azswimming.org/wp-content/uploads/2016/05/1500-Meter-Free-Counting-Sheet.pdf",
        },
    },
    // Arkansas Swimming: https://www.gomotionapp.com/team/czaslsc/page/officials/officials-documents
    //   Their forms are in xls format
    "Connecticut Swimming": {  // https://www.ctswim.org/Meets/Meet-Management/
        all: {
            "All 2-Up": "https://www.ctswim.org/Customer-Content/www/CMS/files/policies_meets/CountingUnivSheet_2up.pdf",
            "All 3-Up": "https://www.ctswim.org/Customer-Content/www/CMS/files/policies_meets/CountingUnivSheet_3up.pdf",
        },
    },
    "Florida Swimming": {  // https://www.floridaswimming.org/page/officials/officials-forms
        SC: {
            "SC": "https://www.floridaswimming.org/szfllsc/UserFiles/Image/Officials%20Info/OFFICIALS%20FORMS/OF%20Across%20the%20boards--yards.pdf",
        },
        LC: {
            "LC": "https://www.floridaswimming.org/szfllsc/UserFiles/Image/Officials%20Info/OFFICIALS%20FORMS/OF%20Across%20the%20boards--meters.pdf",
        },
    },
    // Kentucky Swimming: https://www.gomotionapp.com/team/szkyslsc/page/officials/meet-forms
    //   Their forms are in xls format, and not that different from others here.
    "Minnesota Swimming": {  // https://www.gomotionapp.com/team/czmnlsc/page/officials2/reference-materials
        SC: {
            "500": "/sheets/mn/500.pdf",
            "1000": "/sheets/mn/1000.pdf",
            "1650": "/sheets/mn/1650.pdf",
        },
        LC: {
            "800": "/sheets/mn/800.pdf",
            "1500": "/sheets/mn/1500.pdf",
        },
    },
    "Oklahoma Swimming": {  // https://www.oks.org/page/officials
        SC: {
            "SC": "https://www.oks.org/czokslsc/UserFiles/File/Committees/Officials/SC%20Lap%20Counter%20Form%20--%20All%20Inclusive.pdf",
        },
        LC: {
            "LC": "https://www.oks.org/czokslsc/UserFiles/File/Committees/Officials/LC%20Lap%20Counter%20Form%20--%20All%20Inclusive.pdf",
        },
    },
    "Potomac Valley Swimming": {  // https://www.pvswim.org/official/forms.html
        SC: {
            "500v1": "https://www.pvswim.org/official/forms/500ysheet.pdf",
            "500v2": "https://www.pvswim.org/official/forms/500yLapCounter.pdf",
            "1000v1": "https://www.pvswim.org/official/forms/1000ysheet.pdf",
            "1000v2": "https://www.pvswim.org/official/forms/1000yLapCounter.pdf",
            "1650v1": "https://www.pvswim.org/official/forms/1650ysheet.pdf",
            "1650v2": "https://www.pvswim.org/official/forms/1650yLapCounter.pdf",
            "SCv1": "https://www.pvswim.org/official/forms/SCY%20Lap%20Counter%20Sheets_1.pdf",
            "SCv2": "https://www.pvswim.org/official/forms/SCY%20Lap%20Counter%20Sheets_2.pdf",
        },
        LC: {
            "800v1": "https://www.pvswim.org/official/forms/800mSheet.pdf",
            "800v2": "https://www.pvswim.org/official/forms/800mLapCounter.pdf",
            "1500v1": "https://www.pvswim.org/official/forms/1500mSheet.pdf",
            "1500v2": "https://www.pvswim.org/official/forms/1500mLapCounter.pdf",
        },
    },
    "Wyoming Swimming": {  // https://www.gomotionapp.com/team/wzwyslsc/page/officials/meet-forms
        // They also have counter sheets for counting from the turn end.
        SC: {
            "500": "https://www.gomotionapp.com/wzwyslsc/UserFiles/Image/QuickUpload/500-start-distance-count-sheets_083406.pdf",
            "1000": "https://www.gomotionapp.com/wzwyslsc/UserFiles/Image/QuickUpload/1000-start-distance-count-sheets_076678.pdf",
            "1650": "https://www.gomotionapp.com/wzwyslsc/UserFiles/Image/QuickUpload/1650-sdistance-count-sheets_022110.pdf",
        },
        LC: {
            "1500": "https://www.gomotionapp.com/wzwyslsc/UserFiles/Image/QuickUpload/1500-distance-count-sheet-start-end_045458.pdf",
        },
    },
}
