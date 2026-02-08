'use client';

import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Card,
  CardBody,
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
    setIsFlipped,
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
    <header
      className="z-50 p-2 pb-0"
      style={{ paddingTop: 'calc(var(--simulated-safe-area-top, env(safe-area-inset-top, 0px)) + 0.5rem)' }}
      data-testid="bell-lap-header"
    >
      <Card className="shadow-md bg-content1">
        <CardBody className="flex flex-col gap-2 p-3">
          {/* Row 1: Config & Reset */}
          <div className="flex flex-row items-center justify-between gap-2">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat" size="sm" endContent={<ChevronDown size={14} />}>
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
                <Button variant="flat" size="sm" endContent={<ChevronDown size={14} />}>
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

            <Dropdown>
              <DropdownTrigger>
                <Button variant="flat" size="sm" endContent={<ChevronDown size={14} />} aria-label="Lane Order">
                  {isFlipped ? "Bottom to top" : "Top to bottom"}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Lane Order Selection"
                onAction={(key) => setIsFlipped(key === "bottom-to-top")}
                selectedKeys={[isFlipped ? "bottom-to-top" : "top-to-bottom"]}
                selectionMode="single"
              >
                <DropdownItem key="top-to-bottom">Top to bottom</DropdownItem>
                <DropdownItem key="bottom-to-top">Bottom to top</DropdownItem>
              </DropdownMenu>
            </Dropdown>

            <Button
              isIconOnly
              color="danger"
              variant="flat"
              size="sm"
              onPress={() => setResetModalOpen(true)}
              aria-label="New Race"
            >
              <RotateCcw size={18} />
            </Button>
          </div>

          {/* Row 2: Live Leaderboard */}
          <div className="flex flex-row items-center gap-2 overflow-x-auto min-h-[1.5rem]" data-testid="live-leaderboard">
            <span className="text-[10px] font-bold text-foreground/50 uppercase whitespace-nowrap">Leaderboard:</span>
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
        </CardBody>
      </Card>

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
