export function calculateTimelineScale(durationSeconds: number, availableHeight: number): { secondsPerMarker: number, lineHeight: number } {
    const MIN_LINE_HEIGHT = 8;
    const POSSIBLE_MARKERS = [15, 30, 60, 120, 300, 600];
    let secondsPerMarker = 15;

    for (const m of POSSIBLE_MARKERS) {
        secondsPerMarker = m;
        const markersCount = Math.ceil(durationSeconds / secondsPerMarker) + 1;
        if (availableHeight / (markersCount + 2.5) >= MIN_LINE_HEIGHT) {
            break;
        }
    }

    const markersCount = Math.ceil(durationSeconds / secondsPerMarker) + 1;
    const lineHeight = Math.min(18, availableHeight / (markersCount + 2.5));

    return { secondsPerMarker, lineHeight };
}
