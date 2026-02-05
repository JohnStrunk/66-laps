'use client';

import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Switch,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { useBellLapStore, EventType, EVENT_CONFIGS } from "@/modules/bellLapStore";
import { RotateCcw, ChevronDown } from "lucide-react";
import { useMemo } from "react";

export default function BellLapHeader() {
  const {
    event,
    setEvent,
    laneCount,
    setLaneCount,
    isFlipped,
    toggleFlip,
    isResetModalOpen,
    setResetModalOpen,
    resetRace,
    lanes
  } = useBellLapStore();

  const activeLanes = useMemo(() => {
    return lanes
      .filter(l => !l.isEmpty)
      .sort((a, b) => {
        if (a.count !== b.count) return b.count - a.count;
        const lastA = a.history[a.history.length - 1] || 0;
        const lastB = b.history[b.history.length - 1] || 0;
        if (lastA === 0) return 1;
        if (lastB === 0) return -1;
        return lastA - lastB;
      });
  }, [lanes]);

  const palette = [
    "text-blue-500",
    "text-red-500",
    "text-slate-900 dark:text-slate-100",
    "text-purple-500",
    "text-orange-500",
    "text-teal-500"
  ];

  const getLapColor = (count: number) => {
    if (count === 0) return "text-foreground/50";
    if (count >= EVENT_CONFIGS[event].laps) return "text-success";
    // Map lap count to palette. Using count/2 because it increments by 2.
    const index = (count / 2) % palette.length;
    return palette[Math.floor(index)];
  };

  return (
    <header className="w-full flex flex-col gap-2 p-2 bg-background border-b sticky top-0 z-50">
      {/* Row 1: Config & Reset */}
      <div className="flex flex-row items-center justify-between gap-2">
        <Dropdown>
          <DropdownTrigger>
            <Button variant="flat" endContent={<ChevronDown size={16} />}>
              {event}
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Event Selection"
            onAction={(key) => setEvent(key as EventType)}
            selectedKeys={[event]}
            selectionMode="single"
          >
            <DropdownItem key="500 SC">500 SC</DropdownItem>
            <DropdownItem key="1000 SC">1000 SC</DropdownItem>
            <DropdownItem key="1650 SC">1650 SC</DropdownItem>
            <DropdownItem key="800 LC">800 LC</DropdownItem>
            <DropdownItem key="1500 LC">1500 LC</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <Dropdown>
          <DropdownTrigger>
            <Button variant="flat" endContent={<ChevronDown size={16} />}>
              {laneCount} lanes
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Lane Count"
            onAction={(key) => setLaneCount(Number(key))}
            selectedKeys={[String(laneCount)]}
            selectionMode="single"
          >
            <DropdownItem key="6">6 lanes</DropdownItem>
            <DropdownItem key="8">8 lanes</DropdownItem>
            <DropdownItem key="10">10 lanes</DropdownItem>
          </DropdownMenu>
        </Dropdown>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium">{isFlipped ? "10-1" : "1-10"}</span>
          <Switch
            isSelected={isFlipped}
            onValueChange={toggleFlip}
            size="sm"
            aria-label="Flip Lane Order"
          />
        </div>

        <Button
          isIconOnly
          color="danger"
          variant="flat"
          onPress={() => setResetModalOpen(true)}
          aria-label="New Race"
        >
          <RotateCcw size={20} />
        </Button>
      </div>

      {/* Row 2: Live Leaderboard */}
      <div className="flex flex-row items-center gap-2 overflow-x-auto py-1 min-h-[2rem]" data-testid="live-leaderboard">
        <span className="text-xs font-bold text-foreground/50 uppercase whitespace-nowrap">Leaderboard:</span>
        <div className="flex flex-row gap-2">
          {activeLanes.map((lane) => (
            <span
              key={lane.laneNumber}
              className={`font-black text-lg transition-colors ${getLapColor(lane.count)}`}
              data-testid={`leaderboard-lane-${lane.laneNumber}`}
            >
              {lane.laneNumber}
            </span>
          ))}
        </div>
      </div>

      {/* New Race Confirmation Modal */}
      <Modal isOpen={isResetModalOpen} onClose={() => setResetModalOpen(false)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Start New Race?</ModalHeader>
              <ModalBody>
                This will zero all counts and re-enable all lanes.
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button color="danger" onPress={resetRace}>
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </header>
  );
}
