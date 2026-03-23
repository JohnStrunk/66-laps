import { describe, it, expect } from 'vitest';
import { calculateTimelineScale } from './pdfGenerator';

describe('calculateTimelineScale', () => {
    it('uses 5s markers for races <= 1 min', () => {
        // duration = 60s, availableHeight = 1000
        // markers = ceil(60/5) + 1 = 13
        // lineHeight = 1000 / max(13, 10) = 1000 / 13 = 76.92...
        const result = calculateTimelineScale(60, 1000);
        expect(result.secondsPerMarker).toBe(5);
        expect(result.lineHeight).toBeCloseTo(1000 / 13, 3);
    });

    it('uses 10s markers for races <= 2 mins', () => {
        // duration = 120s, availableHeight = 500
        // markers = ceil(120/10) + 1 = 13
        // lineHeight = 500 / 13 = 38.46...
        const result = calculateTimelineScale(120, 500);
        expect(result.secondsPerMarker).toBe(10);
        expect(result.lineHeight).toBeCloseTo(500 / 13, 3);
    });

    it('uses 15s markers for races <= 5 mins', () => {
        // duration = 300s, availableHeight = 500
        // markers = ceil(300/15) + 1 = 21
        // lineHeight = 500 / 21 = 23.80...
        const result = calculateTimelineScale(300, 500);
        expect(result.secondsPerMarker).toBe(15);
        expect(result.lineHeight).toBeCloseTo(500 / 21, 3);
    });

    it('uses 30s markers for races <= 10 mins', () => {
        // duration = 600s, availableHeight = 800
        // markers = ceil(600/30) + 1 = 21
        // lineHeight = 800 / 21 = 38.09...
        const result = calculateTimelineScale(600, 800);
        expect(result.secondsPerMarker).toBe(30);
        expect(result.lineHeight).toBeCloseTo(800 / 21, 3);
    });

    it('uses 60s markers for races > 10 mins', () => {
        // duration = 1200s, availableHeight = 1000
        // markers = ceil(1200/60) + 1 = 21
        // lineHeight = 1000 / 21 = 47.61...
        const result = calculateTimelineScale(1200, 1000);
        expect(result.secondsPerMarker).toBe(60);
        expect(result.lineHeight).toBeCloseTo(1000 / 21, 3);
    });

    it('enforces a minimum height divisor of 10 markers', () => {
        // duration = 30s, availableHeight = 500
        // secondsPerMarker = 5 (<= 60s)
        // markers = ceil(30/5) + 1 = 7
        // max(7, 10) = 10
        // lineHeight = 500 / 10 = 50
        const result = calculateTimelineScale(30, 500);
        expect(result.secondsPerMarker).toBe(5);
        expect(result.lineHeight).toBe(50);
    });

    it('handles zero duration properly', () => {
        // duration = 0, availableHeight = 100
        // secondsPerMarker = 5 (<= 60s)
        // markers = ceil(0/5) + 1 = 1
        // max(1, 10) = 10
        // lineHeight = 100 / 10 = 10
        const result = calculateTimelineScale(0, 100);
        expect(result.secondsPerMarker).toBe(5);
        expect(result.lineHeight).toBe(10);
    });
});
