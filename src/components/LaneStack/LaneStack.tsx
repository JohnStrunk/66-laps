'use client';

import { useBellLapStore } from "@/modules/bellLapStore";
import LaneRow from "./LaneRow";

export default function LaneStack() {
  const lanes = useBellLapStore(state => state.lanes);
  const isFlipped = useBellLapStore(state => state.isFlipped);

  const displayedLanes = isFlipped ? [...lanes].reverse() : lanes;

  return (
    <div className="flex flex-col w-full h-full gap-2" data-testid="lane-stack">
      {displayedLanes.map((lane) => (
        <LaneRow
          key={lane.laneNumber}
          laneNumber={lane.laneNumber}
        />
      ))}
    </div>
  );
}
