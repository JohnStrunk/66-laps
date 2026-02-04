'use client';

import { Card } from "@heroui/react";
import { useState } from "react";
import LaneRow from "./LaneRow";

interface LaneStackProps {
  laneCount?: number;
}

export default function LaneStack({ laneCount = 8 }: LaneStackProps) {
  // Initialize counts for each lane (1-based index mapped to 0-based array)
  const [counts, setCounts] = useState<number[]>(new Array(laneCount).fill(0));

  const updateCount = (index: number, delta: number) => {
    setCounts((prevCounts) => {
      const newCounts = [...prevCounts];
      // Prevent negative counts
      newCounts[index] = Math.max(0, newCounts[index] + delta);
      return newCounts;
    });
  };

  return (
    <Card className="w-full max-w-3xl shadow-md overflow-hidden">
      <div className="flex flex-col w-full">
        {counts.map((count, index) => (
          <LaneRow
            key={index}
            laneNumber={index + 1}
            count={count}
            onIncrement={() => updateCount(index, 2)}
            onDecrement={() => updateCount(index, -2)}
          />
        ))}
      </div>
    </Card>
  );
}
