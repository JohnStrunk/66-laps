import { Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../../support/world';

interface MockPDFDoc {
  __lastTableOptions?: {
    body?: string[][];
    head?: { content: string; colSpan?: number }[][];
    styles?: { font?: string; fontStyle?: string; textColor?: number | number[] };
    columnStyles?: { [key: number]: { fontStyle?: string } };
  };
  internal: {
    getFont: () => { fontName: string };
  };
}

Then('the generated PDF should use {string} font', async function (this: CustomWorld, expectedFont: string) {
    // Wait for PDF to be generated and stored in window.__lastPDFDoc
    expect(await this.page!.waitForFunction(() => !!(window as unknown as { __lastPDFDoc: MockPDFDoc }).__lastPDFDoc, { timeout: 10000 })).toBeTruthy();

    const fontInfo = await this.page!.evaluate(() => {
        const doc = (window as unknown as { __lastPDFDoc: MockPDFDoc }).__lastPDFDoc;
        if (!doc) return null;
        return {
            docFont: doc.internal.getFont().fontName,
            tableFont: doc.__lastTableOptions?.styles?.font,
            tableStyle: doc.__lastTableOptions?.styles?.fontStyle,
            tableColor: doc.__lastTableOptions?.styles?.textColor,
            col0Style: doc.__lastTableOptions?.columnStyles?.[0]?.fontStyle
        };
    });

    expect(fontInfo, "PDF font info not found").toBeTruthy();
    expect(fontInfo!.docFont, `PDF document should use ${expectedFont} font, but found ${fontInfo!.docFont}`).toBe(expectedFont);
    expect(fontInfo!.tableFont, `OOF table should use ${expectedFont} font, but found ${fontInfo!.tableFont}`).toBe(expectedFont);
    expect(fontInfo!.tableStyle || 'normal', "OOF table body should be normal (lane numbers)").toBe('normal');
    expect(fontInfo!.col0Style, "OOF table LAP column should be bold").toBe('bold');
    expect(fontInfo!.tableColor, `OOF table body text color should be black (0), but found ${fontInfo!.tableColor}`).toBe(0);
});
