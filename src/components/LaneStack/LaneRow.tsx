'use client';

import { Button } from "@heroui/react";
import { Minus, Plus } from "lucide-react";
import { useBellLapStore, EVENT_CONFIGS } from "@/modules/bellLapStore";
import { useRef, useState, useEffect } from "react";

interface LaneRowProps {
  laneNumber: number;
}

export default function LaneRow({
  laneNumber,
}: LaneRowProps) {
  const lane = useBellLapStore(state => state.lanes.find(l => l.laneNumber === laneNumber));
  const event = useBellLapStore(state => state.event);
  const updateLaneCount = useBellLapStore(state => state.updateLaneCount);
  const toggleLaneEmpty = useBellLapStore(state => state.toggleLaneEmpty);
  const registerTouch = useBellLapStore(state => state.registerTouch);

  const [now, setNow] = useState(() => Date.now());
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const config = EVENT_CONFIGS[event];
  const lastTouch = lane?.history[lane.history.length - 1] || 0;
  const lockoutMs = config.lockout * 1000;
  const elapsed = now - lastTouch;
  const isLocked = !!lane && !lane.isEmpty && elapsed < lockoutMs;
  const progress = isLocked ? (elapsed / lockoutMs) * 100 : 0;

  useEffect(() => {
    if (isLocked) {
      const interval = setInterval(() => {
        const currentNow = Date.now();
        setNow(currentNow);
        if (currentNow - lastTouch >= lockoutMs) {
          clearInterval(interval);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isLocked, lastTouch, lockoutMs]);

  if (!lane) return null;

  const handleTouchStart = () => {
    longPressTimer.current = setTimeout(() => {
      toggleLaneEmpty(laneNumber);
      longPressTimer.current = null;
    }, 1000);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
      if (!lane.isEmpty) {
        registerTouch(laneNumber);
        setNow(Date.now());
      }
    }
  };

  return (
    <div
      className={`flex w-full flex-1 min-h-0 border-b border-divider last:border-b-0 transition-opacity ${lane.isEmpty ? 'bg-content2' : ''}`}
      data-testid="lane-row"
      data-lane-number={laneNumber}
    >
      {/* Zone A: Manual Controls (35%) */}
      <div className={`basis-[35%] flex flex-row items-center justify-center gap-4 border-r border-divider bg-content2 p-2 ${lane.isEmpty ? 'invisible' : ''}`} data-testid="lane-zone-a">
        <Button
          isIconOnly
          color="danger"
          variant="flat"
          onPress={() => updateLaneCount(laneNumber, -2)}
          isDisabled={lane.count <= 0}
          aria-label={`Decrement lane ${laneNumber}`}
          className="w-12 h-12"
        >
          <Minus size={24} />
        </Button>
        <div className="flex flex-col items-center min-w-[3rem]">
          <span className="text-4xl font-black text-foreground" data-testid="lane-count">
            {lane.count}
          </span>
          <span className="text-[10px] uppercase font-bold text-foreground/50">Laps</span>
        </div>
        <Button
          isIconOnly
          color="success"
          variant="flat"
          onPress={() => updateLaneCount(laneNumber, 2)}
          aria-label={`Increment lane ${laneNumber}`}
          className="w-12 h-12"
        >
          <Plus size={24} />
        </Button>
      </div>

      {/* Zone B: Touch Pad (65%) */}
      <div
        className={`basis-[65%] relative flex items-center justify-center overflow-hidden transition-colors ${
          lane.isEmpty
            ? 'bg-content2 cursor-default'
            : isLocked
              ? 'bg-content3 cursor-wait'
              : 'bg-success cursor-pointer active:opacity-80'
        }`}
        data-testid="lane-zone-b"
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onMouseLeave={() => { if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; } }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        role="button"
        tabIndex={0}
        aria-label={`Lane ${laneNumber} touch pad. ${lane.isEmpty ? 'EMPTY' : `Current count: ${lane.count}`}`}
      >
        {/* Lockout Progress Bar */}
        {isLocked && (
          <div
            className="absolute inset-0 bg-foreground/20 origin-left transition-transform duration-100 ease-linear"
            style={{ transform: `scaleX(${progress / 100})` }}
            data-testid="lockout-progress"
          />
        )}

        {/* Content */}
        <span className={`z-10 text-4xl font-black select-none ${lane.isEmpty ? 'text-foreground/40' : isLocked ? 'text-foreground/60' : 'text-white'}`}>
          {lane.isEmpty ? "EMPTY" : `LANE ${laneNumber}`}
        </span>
      </div>
    </div>
  );
}
