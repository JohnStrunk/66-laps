'use client';

import { RaceRecord } from "@/modules/bellLapStore";
import { useMemo } from "react";

interface TimelineViewProps {
  race: RaceRecord;
}

const SECONDS_PER_LINE = 15;
const LINE_HEIGHT = 24; // pixels per 15s

export function TimelineView({ race }: TimelineViewProps) {
  const duration = useMemo(() => {
    let maxTime = 0;
    race.lanes.forEach(lane => {
      lane.events.forEach(event => {
        if (event.timestamp > maxTime) maxTime = event.timestamp;
      });
    });

    if (maxTime === 0) return 0;
    return (maxTime - race.startTime) / 1000;
  }, [race]);

  // Generate markers every 15s
  const markers = useMemo(() => {
    const m = [];
    const totalLines = Math.ceil(duration / SECONDS_PER_LINE) + 2; // Extra buffer
    for (let i = 0; i <= totalLines; i++) {
      const seconds = i * SECONDS_PER_LINE;
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      const label = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
      const isWholeMinute = remainingSeconds === 0;

      m.push({
        label,
        isWholeMinute,
        top: i * LINE_HEIGHT
      });
    }
    return m;
  }, [duration]);

  const laneEvents = useMemo(() => {
    return race.lanes.map(lane => {
      return lane.events
        .filter(e => e.type === 'touch' || e.type === 'manual_increment')
        .map(e => ({
          lap: e.newCount,
          top: ((e.timestamp - race.startTime) / 1000 / SECONDS_PER_LINE) * LINE_HEIGHT,
          laneNumber: lane.laneNumber
        }));
    }).flat();
  }, [race]);

  const laneNumbers = useMemo(() => {
    return Array.from({ length: race.laneCount }, (_, i) => i + 1);
  }, [race.laneCount]);

  return (
    <div className="flex flex-col h-full w-full overflow-hidden relative border rounded-md border-default-100" data-testid="timeline-view">
      {/* Header */}
      <div className="flex shrink-0 border-b border-default-200 bg-default-50 sticky top-0 z-20">
        <div className="w-12 shrink-0 border-r border-default-200" />
        {laneNumbers.map(n => (
          <div key={n} className="flex-1 text-center py-1 text-xs font-bold text-default-500 border-r border-default-100 last:border-r-0" data-testid={`lane-header-${n}`}>
            {n}
          </div>
        ))}
      </div>

      {/* Scrollable Area */}
      <div className="flex-1 overflow-y-auto relative">
        <div className="flex relative" style={{ height: (markers.length * LINE_HEIGHT) }}>
          {/* Time Column */}
          <div className="w-12 shrink-0 border-r border-default-200 bg-default-50/50 sticky left-0 z-10">
            {markers.map((m, i) => (
              <div
                key={i}
                className="absolute left-0 w-full flex items-center justify-center text-[10px] text-default-400"
                style={{ top: m.top, height: LINE_HEIGHT }}
              >
                {m.isWholeMinute ? (
                  <span className="font-bold text-default-600" data-testid={`time-label-${m.label}`}>{m.label}</span>
                ) : (
                  <div className="w-1 h-[1px] bg-default-200" data-testid={`time-marker-${m.label}`} />
                )}
              </div>
            ))}
          </div>

          {/* Grid and Events */}
          <div className="flex-1 relative">
            {/* Horizontal Grid Lines */}
            {markers.map((m, i) => (
              <div
                key={i}
                className="absolute left-0 w-full h-[1px] bg-default-100 pointer-events-none"
                style={{ top: m.top + (LINE_HEIGHT / 2) }}
              />
            ))}

            {/* Vertical Lane Dividers */}
            {laneNumbers.slice(0, -1).map(n => (
              <div
                key={n}
                className="absolute h-full border-r border-default-100 pointer-events-none"
                style={{ left: `${(n / race.laneCount) * 100}%` }}
              />
            ))}

            {/* Lap Counts */}
            {laneEvents.map((ev, i) => (
              <div
                key={i}
                className="absolute -translate-x-1/2 -translate-y-1/2 flex items-center justify-center font-bold text-sm bg-background/80 rounded px-1 min-w-[1.2rem]"
                style={{
                  top: ev.top + (LINE_HEIGHT / 2),
                  left: `${((ev.laneNumber - 0.5) / race.laneCount) * 100}%`
                }}
                data-testid={`lap-count-${ev.laneNumber}-${ev.lap}`}
              >
                {ev.lap}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
