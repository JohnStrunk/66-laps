'use client';

import { Card } from "@heroui/react";
import { useBellLapStore } from "@/modules/bellLapStore";
import LaneRow from "./LaneRow";

export default function LaneStack() {
  const lanes = useBellLapStore(state => state.lanes);
  const isFlipped = useBellLapStore(state => state.isFlipped);

  const displayedLanes = isFlipped ? [...lanes].reverse() : lanes;

  return (
    <Card className="w-full h-full max-w-3xl shadow-md overflow-hidden" data-testid="lane-stack">
      <div className="flex flex-col w-full h-full">
        {displayedLanes.map((lane) => (
          <LaneRow
            key={lane.laneNumber}
            laneNumber={lane.laneNumber}
          />
        ))}
      </div>
    </Card>
  );
}
