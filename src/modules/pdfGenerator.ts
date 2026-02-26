import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { RaceRecord, EVENT_CONFIGS } from './bellLapStore';

// Type extension for jspdf-autotable
type jsPDFWithAutoTable = jsPDF & {
    lastAutoTable: {
        finalY: number;
    };
};

async function getBase64Image(url: string): Promise<string> {
    try {
        const response = await fetch(url);
        const blob = await response.blob();

        // Handle SVG conversion to PNG via canvas for jsPDF compatibility
        if (blob.type === 'image/svg+xml') {
            const svgText = await blob.text();
            return new Promise((resolve) => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                const img = new Image();
                // Safe base64 encoding for SVG
                const base64Svg = btoa(unescape(encodeURIComponent(svgText)));
                img.src = 'data:image/svg+xml;base64,' + base64Svg;
                img.onload = () => {
                    // Use a reasonable size for the logo
                    canvas.width = img.width || 512;
                    canvas.height = img.height || 512;
                    ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                    resolve(canvas.toDataURL('image/png'));
                };
                img.onerror = () => {
                    resolve('');
                };
            });
        }

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    } catch (e) {
        console.error('Failed to load logo', e);
        return '';
    }
}

function getFilename(race: RaceRecord): string {
    const d = new Date(race.startTime);
    const yy = d.getFullYear().toString().slice(-2);
    const mm = (d.getMonth() + 1).toString().padStart(2, '0');
    const dd = d.getDate().toString().padStart(2, '0');
    const hh_24 = d.getHours().toString().padStart(2, '0');
    const min = d.getMinutes().toString().padStart(2, '0');
    const timestamp = `${yy}${mm}${dd}${hh_24}${min}`;

    let filename = `Race-${timestamp}`;
    if (race.eventNumber) filename += `-E${race.eventNumber}`;
    if (race.heatNumber) filename += `-H${race.heatNumber}`;
    return `${filename}.pdf`;
}

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

export async function generateRacePDF(race: RaceRecord): Promise<jsPDF> {
    const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'pt',
        format: 'letter'
    }) as jsPDFWithAutoTable;

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 36; // 0.5 inch

    // --- Header ---
    const logoBase64 = await getBase64Image('/icon.svg');
    let headerTextX = margin;
    if (logoBase64) {
        doc.addImage(logoBase64, 'PNG', margin, margin, 40, 40);
        headerTextX = margin + 50;
    }

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(0);

    let raceInfo = race.event;
    if (race.eventNumber) raceInfo += ` | Event ${race.eventNumber}`;
    if (race.heatNumber) raceInfo += ` | Heat ${race.heatNumber}`;
    doc.text(raceInfo, headerTextX, margin + 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    const dateStr = new Date(race.startTime).toLocaleDateString();
    const timeStr = new Date(race.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    doc.text(`${dateStr} | ${timeStr}`, headerTextX, margin + 32);

    const headerBottom = margin + 60;

    // --- Left Column: OOF by Lap ---
    const columnWidth = (pageWidth - margin * 3) / 2;
    const leftColX = margin;
    const rightColX = margin * 2 + columnWidth;

    const config = EVENT_CONFIGS[race.event];
    const maxLaps = config.laps;
    const laps: number[] = [];
    for (let i = 2; i <= maxLaps; i += 2) {
        laps.push(i);
    }

    const lapOOFData = laps.map(lapNum => {
        const laneTimes: { laneNumber: number, timestamp: number }[] = [];
        race.lanes.forEach(lane => {
            const completions = lane.events.filter(e => e.newCount >= lapNum && e.prevCount < lapNum);
            if (completions.length > 0) {
                const latestCompletion = completions.reduce((latest, current) =>
                    current.timestamp > latest.timestamp ? current : latest
                );
                laneTimes.push({
                    laneNumber: lane.laneNumber,
                    timestamp: latestCompletion.timestamp
                });
            }
        });
        laneTimes.sort((a, b) => a.timestamp - b.timestamp);
        return {
            lap: lapNum.toString(),
            oof: laneTimes.map(lt => lt.laneNumber).join(' | ')
        };
    });

        autoTable(doc, {
            startY: headerBottom,
            margin: { left: leftColX, right: pageWidth - (leftColX + columnWidth) },
            head: [['LAP', 'ORDER OF FINISH']],
            body: lapOOFData.map(d => [d.lap, d.oof]),
            theme: 'striped',
            headStyles: { fillColor: [44, 62, 80], textColor: 255, fontSize: 10, halign: 'center' },
            styles: { fontSize: 9, cellPadding: 2 },
            columnStyles: {
                0: { fontStyle: 'bold', cellWidth: 30, halign: 'center' },
                1: { fontSize: 11, fontStyle: 'bold', halign: 'center' }
            }
        });

        // --- Right Column: Laps by Time (Timeline) ---
        const timelineStartY = headerBottom;
        const timelineHeight = pageHeight - margin * 2 - 60 - 30; // 30 for footer

        // Calculate duration
        let maxTime = 0;
        race.lanes.forEach(lane => {
            lane.events.forEach(event => {
                if (event.timestamp > maxTime) maxTime = event.timestamp;
            });
        });
        const durationSeconds = maxTime > 0 ? (maxTime - race.startTime) / 1000 : 0;

                    // Scale timeline to fit
                    const { secondsPerMarker, lineHeight } = calculateTimelineScale(durationSeconds, timelineHeight);

                    // @ts-ignore - attaching for tests
                    doc.__test_scale = { secondsPerMarker, lineHeight };

                    const totalMarkers = Math.ceil(durationSeconds / secondsPerMarker) + 1;
                                // Right Column Header (Reverse Text)

            const headHeight = 16;
            const timeColWidth = 35;
            const gridX = rightColX + timeColWidth;
            const gridWidth = columnWidth - timeColWidth;

            doc.setFillColor(44, 62, 80);
            doc.rect(rightColX, timelineStartY, columnWidth, headHeight, 'F');
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(255);
            doc.text('TIME', rightColX + timeColWidth / 2, timelineStartY + headHeight / 2, { align: 'center', baseline: 'middle' });
            doc.text('LAP COUNT', gridX + gridWidth / 2, timelineStartY + headHeight / 2, { align: 'center', baseline: 'middle' });

            // Timeline Grid
            const laneWidth = gridWidth / race.laneCount;

            // Draw Lane Headers
            doc.setFontSize(8);
            doc.setTextColor(100);
            for (let i = 1; i <= race.laneCount; i++) {
                const lx = gridX + (i - 0.5) * laneWidth;
                doc.text(i.toString(), lx, timelineStartY + headHeight + 10, { align: 'center' });
            }
            const timelineContentStartY = timelineStartY + headHeight + 20;

            // Draw Markers and Labels
            for (let i = 0; i < totalMarkers; i++) {
                const y = timelineContentStartY + i * lineHeight;
                const seconds = i * secondsPerMarker;
                const minutes = Math.floor(seconds / 60);
                const remSeconds = seconds % 60;
                const label = `${minutes.toString().padStart(2, '0')}:${remSeconds.toString().padStart(2, '0')}`;
                const isWholeMinute = remSeconds === 0;

                if (isWholeMinute) {
                    doc.setDrawColor(180);
                    doc.setLineWidth(0.5);
                    doc.line(rightColX, y, rightColX + columnWidth, y);
                    doc.setFontSize(7);
                    doc.setFont('helvetica', 'bold');
                    doc.setTextColor(80);
                    doc.text(label, rightColX, y, { baseline: 'middle' });
                } else {
                    doc.setDrawColor(220);
                    doc.setLineWidth(0.3);
                    doc.line(gridX, y, gridX + gridWidth, y);
                    doc.setFontSize(6);
                    doc.setFont('helvetica', 'normal');
                    doc.setTextColor(150);
                    doc.text(label, rightColX, y, { baseline: 'middle' });
                }
            }

            // Draw Lane Vertical Dividers
            doc.setDrawColor(230);
            doc.setLineWidth(0.2);
            for (let i = 0; i <= race.laneCount; i++) {
                const lx = gridX + i * laneWidth;
                doc.line(lx, timelineContentStartY, lx, timelineContentStartY + (totalMarkers - 1) * lineHeight);
            }

            // Draw Events
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.setTextColor(0);
            race.lanes.forEach(lane => {
                lane.events
                    .filter(e => e.type === 'touch' || e.type === 'manual_increment')
                    .forEach(e => {
                        const elapsed = (e.timestamp - race.startTime) / 1000;
                        const y = timelineContentStartY + (elapsed / secondsPerMarker) * lineHeight;
                        const x = gridX + (lane.laneNumber - 0.5) * laneWidth;

                        // Draw a small white circle background for readability
                        doc.setFillColor(255, 255, 255);
                        doc.circle(x, y, 5, 'F');

                        // Draw just the lap number, vertically centered
                        doc.text(e.newCount.toString(), x, y, { align: 'center', baseline: 'middle' });
                    });
            });


    // --- Footer ---
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text('Count laps from your mobile device — https://66-laps.com', pageWidth / 2, pageHeight - margin, { align: 'center' });

    return doc;
}

export async function downloadRacePDF(race: RaceRecord): Promise<void> {
    const doc = await generateRacePDF(race);
    const filename = getFilename(race);
    if (typeof window !== 'undefined' && window.location.search.includes('testMode=true')) {
        (window as any).__lastPDFDoc = doc;
        (window as unknown as { __lastDownloadName: string }).__lastDownloadName = filename;
        (window as unknown as { __downloadClicked: boolean }).__downloadClicked = true;
    }
    doc.save(filename);
}

export async function shareRacePDF(race: RaceRecord): Promise<void> {
    const doc = await generateRacePDF(race);
    const pdfBlob = doc.output('blob');
    const fileName = getFilename(race);
    if (typeof window !== 'undefined' && window.location.search.includes('testMode=true')) {
        (window as any).__lastPDFDoc = doc;
        (window as unknown as { __lastDownloadName: string }).__lastDownloadName = fileName;
    }
    const file = new File([pdfBlob], fileName, { type: 'application/pdf' });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
        try {
            await navigator.share({
                files: [file],
                title: `Race History - ${race.event}`,
                text: `Race history for ${race.event} on ${new Date(race.startTime).toLocaleDateString()}`
            });
        } catch (err) {
            if ((err as Error).name !== 'AbortError') {
                console.error('Error sharing:', err);
                if (typeof window !== 'undefined' && window.location.search.includes('testMode=true')) {
                    (window as unknown as { __downloadClicked: boolean }).__downloadClicked = true;
                }
                doc.save(fileName);
            }
        }
    } else {
        if (typeof window !== 'undefined' && window.location.search.includes('testMode=true')) {
            (window as unknown as { __downloadClicked: boolean }).__downloadClicked = true;
        }
        doc.save(fileName);
    }
}
