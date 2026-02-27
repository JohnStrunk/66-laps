'use client';

import { Button, Card, CardBody } from "@heroui/react";
import { Minus, Plus } from "lucide-react";
import { useBellLapStore, EVENT_CONFIGS, getLaneStatus } from "@/modules/bellLapStore";
import { useRef } from "react";

interface LaneRowProps {
  laneNumber: number;
}

export default function LaneRow({
  laneNumber,
}: LaneRowProps) {
  const lane = useBellLapStore(state => state.lanes.find(l => l.laneNumber === laneNumber));
  const now = useBellLapStore(state => state.now);
  const event = useBellLapStore(state => state.event);
  const updateLaneCount = useBellLapStore(state => state.updateLaneCount);
  const toggleLaneEmpty = useBellLapStore(state => state.toggleLaneEmpty);
  const registerTouch = useBellLapStore(state => state.registerTouch);

  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const { isFinished, isLocked, progress, symbol } = getLaneStatus(lane, event, now);

  if (!lane) return null;

  const config = EVENT_CONFIGS[event];

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
    <Card
      className={`flex-1 min-h-0 transition-opacity shadow-sm ${
        lane.isEmpty ? 'bg-neutral-200 dark:bg-neutral-900 opacity-60' : 'bg-content1'
      }`}
      data-testid="lane-row"
      data-lane-number={laneNumber}
    >
      <CardBody
        className="p-0 flex flex-row w-full h-full overflow-hidden"
        onMouseDown={lane.isEmpty ? handleTouchStart : undefined}
        onMouseUp={lane.isEmpty ? handleTouchEnd : undefined}
        onMouseLeave={lane.isEmpty ? () => { if (longPressTimer.current) { clearTimeout(longPressTimer.current); longPressTimer.current = null; } } : undefined}
        onTouchStart={lane.isEmpty ? handleTouchStart : undefined}
        onTouchEnd={lane.isEmpty ? handleTouchEnd : undefined}
      >
        {lane.isEmpty ? (
          <div
            className="flex-1 flex items-center justify-center"
            data-testid="lane-empty-state"
          >
            <span className="text-4xl font-black select-none text-foreground/40">
              EMPTY
            </span>
          </div>
        ) : (
          <>
            {/* Zone A: Manual Controls (50%) */}
            <div
              className="basis-[50%] w-[50%] flex-none flex flex-row items-center justify-center gap-1 sm:gap-2 border-r border-divider p-2 overflow-hidden"
              data-testid="lane-zone-a"
            >
              <Button
                isIconOnly
                color="danger"
                variant="flat"
                onPress={() => {
                  updateLaneCount(laneNumber, -2);
                }}
                isDisabled={lane.count <= 0}
                data-disabled={lane.count <= 0}
                data-testid={`decrement-button-lane-${laneNumber}`}
                aria-label={`Decrement lane ${laneNumber}`}
                className="w-12 h-12 min-w-12"
              >
                <Minus size={24} />
              </Button>
              <div className="flex flex-col items-center min-w-[2rem] sm:min-w-[3rem]">
                <span
                  className="text-xl sm:text-3xl font-black select-none whitespace-nowrap"
                  data-testid="lane-count"
                >
                  {lane.count}
                </span>
              </div>
              <Button
                isIconOnly
                color="success"
                variant="flat"
                onPress={() => {
                  updateLaneCount(laneNumber, 2);
                }}
                isDisabled={lane.count >= config.laps}
                data-disabled={lane.count >= config.laps}
                data-testid={`increment-button-lane-${laneNumber}`}
                aria-label={`Increment lane ${laneNumber}`}
                className="w-12 h-12 min-w-12"
              >
                <Plus size={24} />
              </Button>
            </div>

            {/* Zone B: Touch Pad (50%) */}
            <div
              className={`basis-[50%] relative flex items-center justify-center overflow-hidden transition-colors ${
                isFinished
                  ? 'bg-white text-black pointer-events-none'
                  : isLocked
                  ? 'bg-content3 cursor-wait'
                  : 'bg-success cursor-pointer active:opacity-80'
              }`}
              data-testid="lane-zone-b"
              onMouseDown={handleTouchStart}
              onMouseUp={handleTouchEnd}
              onMouseLeave={() => {
                if (longPressTimer.current) {
                  clearTimeout(longPressTimer.current);
                  longPressTimer.current = null;
                }
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              role="button"
              tabIndex={0}
              aria-label={`${symbol} Lane ${laneNumber} touch pad. Current count: ${lane.count}`}
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
              <span
                className={`z-10 text-xl sm:text-3xl font-black select-none whitespace-nowrap ${
                  isFinished ? 'text-black' : isLocked ? 'text-foreground/60' : 'text-white'
                }`}
              >
                {symbol && `${symbol} `}
                {`LANE ${laneNumber}`}
                {symbol && ` ${symbol}`}
              </span>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
