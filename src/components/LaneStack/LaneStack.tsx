'use client';

import { useBellLapStore } from "@/modules/bellLapStore";
import LaneRow from "./LaneRow";

export default function LaneStack() {
  const lanes = useBellLapStore(state => state.lanes);
  const laneCount = useBellLapStore(state => state.laneCount);
  const isFlipped = useBellLapStore(state => state.isFlipped);

  const displayedLanes = lanes.slice(0, laneCount);
  const finalLanes = isFlipped ? [...displayedLanes].reverse() : displayedLanes;

  return (
    <div className="flex flex-col w-full h-full gap-2" data-testid="lane-stack">
      {finalLanes.map((lane) => (
        <LaneRow
          key={lane.laneNumber}
          laneNumber={lane.laneNumber}
        />
      ))}
    </div>
  );
}
