import { Button } from "@heroui/react";
import { Minus, Plus } from "lucide-react";

interface LaneRowProps {
  laneNumber: number;
  count: number;
  onIncrement: () => void;
  onDecrement: () => void;
}

export default function LaneRow({
  laneNumber,
  count,
  onIncrement,
  onDecrement,
}: LaneRowProps) {
  return (
    <div className="flex w-full h-24 border-b border-divider last:border-b-0">
      {/* Zone A: Manual Controls (35%) */}
      <div className="flex-[0.35] flex flex-row items-center justify-center gap-2 border-r border-divider bg-content2 p-2">
        <Button
          isIconOnly
          color="danger"
          variant="flat"
          onPress={onDecrement}
          isDisabled={count <= 0}
          aria-label={`Decrement lane ${laneNumber}`}
          className="w-10 h-10"
        >
          <Minus />
        </Button>
        <Button
          isIconOnly
          color="success"
          variant="flat"
          onPress={onIncrement}
          aria-label={`Increment lane ${laneNumber}`}
          className="w-10 h-10"
        >
          <Plus />
        </Button>
      </div>

      {/* Zone B: Touch Pad (65%) */}
      <div
        className="flex-[0.65] relative flex items-center justify-center cursor-pointer active:bg-content3 transition-colors bg-content1"
        onClick={onIncrement}
        role="button"
        tabIndex={0}
        aria-label={`Lane ${laneNumber} touch pad. Current count: ${count}`}
      >
        {/* Lane Number Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <span className="text-8xl font-black text-foreground/5 select-none">
            {laneNumber}
          </span>
        </div>

        {/* Current Count Display (Optional but helpful for feedback) */}
         <span className="z-10 text-4xl font-bold text-foreground">
            {count}
          </span>
      </div>
    </div>
  );
}
