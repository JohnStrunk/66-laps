'use client';

import { Button, Card, CardBody } from "@heroui/react";
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
  const isFinished = lane?.count === config.laps;
  const isLocked = !!lane && !lane.isEmpty && elapsed < lockoutMs && !isFinished;
  const progress = isLocked ? (elapsed / lockoutMs) * 100 : 0;

  const isRedSquare = lane?.count === config.laps - 2;
  const isBellLap = lane?.count === config.laps - 4;

  let symbol = "";
  if (isFinished) symbol = "🏁";
  else if (isRedSquare) symbol = "🟥";
  else if (isBellLap) symbol = "🔔";

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
    <Card
      className={`flex-1 min-h-0 transition-opacity shadow-sm ${
        lane.isEmpty ? 'bg-neutral-200 opacity-60' : 'bg-content1'
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
            {/* Zone A: Manual Controls (35%) */}
            <div
              className="basis-[35%] flex flex-row items-center justify-center gap-2 border-r border-divider bg-white text-black p-2"
              data-testid="lane-zone-a"
            >
              <Button
                isIconOnly
                color="danger"
                variant="flat"
                onPress={() => {
                  updateLaneCount(laneNumber, -2);
                  setNow(Date.now());
                }}
                isDisabled={lane.count <= 0}
                aria-label={`Decrement lane ${laneNumber}`}
                className="w-12 h-12 min-w-12"
              >
                <Minus size={24} />
              </Button>
              <div className="flex flex-col items-center min-w-[3rem]">
                <span className="text-4xl font-black" data-testid="lane-count">
                  {lane.count}
                </span>
              </div>
              <Button
                isIconOnly
                color="success"
                variant="flat"
                onPress={() => {
                  updateLaneCount(laneNumber, 2);
                  setNow(Date.now());
                }}
                aria-label={`Increment lane ${laneNumber}`}
                className="w-12 h-12 min-w-12"
              >
                <Plus size={24} />
              </Button>
            </div>

            {/* Zone B: Touch Pad (65%) */}
            <div
              className={`basis-[65%] relative flex items-center justify-center overflow-hidden transition-colors ${
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
