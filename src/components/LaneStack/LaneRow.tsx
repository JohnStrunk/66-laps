'use client';

import { Button } from "@heroui/react";
import { Minus, Plus } from "lucide-react";
import { useBellLapStore } from "@/modules/bellLapStore";
import { useRef } from "react";

interface LaneRowProps {
  laneNumber: number;
}

export default function LaneRow({
  laneNumber,
}: LaneRowProps) {
  const lane = useBellLapStore(state => state.lanes.find(l => l.laneNumber === laneNumber));
  const updateLaneCount = useBellLapStore(state => state.updateLaneCount);
  const toggleLaneEmpty = useBellLapStore(state => state.toggleLaneEmpty);
  const registerTouch = useBellLapStore(state => state.registerTouch);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

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
      }
    }
  };

  return (
    <div
      className={`flex w-full flex-1 min-h-0 border-b border-divider last:border-b-0 transition-opacity ${lane.isEmpty ? 'opacity-40 bg-content2' : ''}`}
      data-testid="lane-row"
      data-lane-number={laneNumber}
    >
      {/* Zone A: Manual Controls (35%) */}
      <div className={`basis-[35%] flex flex-row items-center justify-center gap-2 border-r border-divider bg-content2 p-2 ${lane.isEmpty ? 'invisible' : ''}`} data-testid="lane-zone-a">
        <Button
          isIconOnly
          color="danger"
          variant="flat"
          onPress={() => updateLaneCount(laneNumber, -2)}
          isDisabled={lane.count <= 0}
          aria-label={`Decrement lane ${laneNumber}`}
          className="w-10 h-10"
        >
          <Minus />
        </Button>
        <span className="text-xl font-bold min-w-[2rem] text-center" data-testid="lane-count-manual">
          {lane.count}
        </span>
        <Button
          isIconOnly
          color="success"
          variant="flat"
          onPress={() => updateLaneCount(laneNumber, 2)}
          aria-label={`Increment lane ${laneNumber}`}
          className="w-10 h-10"
        >
          <Plus />
        </Button>
      </div>

      {/* Zone B: Touch Pad (65%) */}
      <div
        className={`basis-[65%] relative flex items-center justify-center transition-colors ${lane.isEmpty ? 'cursor-default' : 'cursor-pointer active:bg-content3 bg-content1'}`}
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
        {/* Lane Number Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="text-8xl font-black text-foreground/5 select-none">
            {lane.isEmpty ? "EMPTY" : laneNumber}
          </span>
        </div>

        {/* Current Count Display */}
        {!lane.isEmpty && (
          <span className="z-10 text-4xl font-bold text-foreground" data-testid="lane-count">
            {lane.count}
          </span>
        )}
      </div>
    </div>
  );
}
