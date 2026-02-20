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
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useBellLapStore, EventType, EVENT_CONFIGS } from "@/modules/bellLapStore";
import { RotateCcw, ChevronDown, Moon, Sun, SunMoon } from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePostHog } from "posthog-js/react";
import { ph_event_set_theme } from "@/modules/phEvents";

export default function BellLapHeader() {
  const {
    event,
    laneCount,
    eventNumber,
    heatNumber,
    isFlipped,
    setIsFlipped,
    isSetupDialogOpen,
    setSetupDialogOpen,
    startRace,
    lanes
  } = useBellLapStore();

  const { theme, setTheme } = useTheme();
  const postHog = usePostHog();
  const [mounted, setMounted] = useState(false);

  // Local state for the dialog
  const [localEvent, setLocalEvent] = useState<EventType>(event);
  const [localLaneCount, setLocalLaneCount] = useState<number>(laneCount);
  const [localEventNumber, setLocalEventNumber] = useState<string>(eventNumber);
  const [localHeatNumber, setLocalHeatNumber] = useState<string>(heatNumber);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  // Update local state when dialog opens
  useEffect(() => {
    if (isSetupDialogOpen) {
      setLocalEvent(event);
      setLocalLaneCount(laneCount);
      setLocalEventNumber(eventNumber);
      setLocalHeatNumber(heatNumber);
    }
  }, [isSetupDialogOpen, event, laneCount, eventNumber, heatNumber]);

  const activeLanes = useMemo(() => {
    const count = typeof laneCount === 'number' && !isNaN(laneCount) ? laneCount : 8;
    return lanes
      .filter(l => !l.isEmpty)
      .slice(0, count)
      .sort((a, b) => {
        if (a.count !== b.count) return b.count - a.count;
        const lastA = a.history[a.history.length - 1] || 0;
        const lastB = b.history[b.history.length - 1] || 0;
        if (lastA === 0) return 1;
        if (lastB === 0) return -1;
        return lastA - lastB;
      });
  }, [lanes, laneCount]);

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
    const index = (count / 2) % palette.length;
    return palette[Math.floor(index)];
  };

  const toggleTheme = () => {
    const modes: ("system" | "dark" | "light")[] = ["system", "dark", "light"];
    const currentIndex = modes.indexOf(theme as "system" | "dark" | "light");
    const nextMode = modes[(currentIndex + 1) % modes.length];
    setTheme(nextMode);
    ph_event_set_theme(postHog, nextMode);
  };

  const renderThemeIcon = () => {
    if (!mounted) return <SunMoon size={18} />;
    if (theme === "system") return <SunMoon size={18} />;
    if (theme === "dark") return <Moon size={18} />;
    return <Sun size={18} />;
  };

  const handleStartRace = () => {
    startRace(localEvent, localLaneCount, localEventNumber, localHeatNumber);
  };

  const safeLaneCount = typeof laneCount === 'number' && !isNaN(laneCount) ? laneCount : 8;

  return (
    <header
      className="z-50 p-2 pb-0"
      style={{ paddingTop: 'calc(var(--simulated-safe-area-top, env(safe-area-inset-top, 0px)) + 0.5rem)' }}
      data-testid="bell-lap-header"
    >
      <Card className="shadow-md bg-content1">
        <CardBody className="flex flex-col gap-1 sm:gap-2 p-2 sm:p-3">
          {/* Row 1: Race Info & Controls */}
          <div className="flex flex-row items-center justify-between gap-1">
            <div className="flex flex-row items-center gap-2 flex-grow overflow-hidden">
              <span className="font-bold whitespace-nowrap text-small sm:text-medium" data-testid="header-event-name">{event}</span>
              {eventNumber && <span className="text-xs sm:text-sm text-foreground/70 whitespace-nowrap" data-testid="header-event-number">Ev {eventNumber}</span>}
              {heatNumber && <span className="text-xs sm:text-sm text-foreground/70 whitespace-nowrap" data-testid="header-heat-number">Ht {heatNumber}</span>}
            </div>

            <div className="flex flex-row items-center gap-1">
              <Dropdown>
                <DropdownTrigger>
                  <Button variant="flat" size="sm" className="min-w-0 px-2" endContent={<ChevronDown size={14} />} aria-label="Lane Order" data-testid="lane-order-dropdown-trigger">
                    {isFlipped ? `${safeLaneCount} - 1` : `1 - ${safeLaneCount}`}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  aria-label="Lane Order Selection"
                  onAction={(key) => setIsFlipped(key === "bottom-to-top")}
                  selectedKeys={[isFlipped ? "bottom-to-top" : "top-to-bottom"]}
                  selectionMode="single"
                >
                  <DropdownItem key="top-to-bottom">{`1 - ${safeLaneCount}`}</DropdownItem>
                  <DropdownItem key="bottom-to-top">{`${safeLaneCount} - 1`}</DropdownItem>
                </DropdownMenu>
              </Dropdown>

              <Button
                isIconOnly
                color="danger"
                variant="flat"
                size="sm"
                onPress={() => setSetupDialogOpen(true)}
                aria-label="Reset"
                data-testid="reset-button"
              >
                <RotateCcw size={18} />
              </Button>

              <Button
                isIconOnly
                variant="flat"
                size="sm"
                onPress={toggleTheme}
                aria-label="Toggle light/dark mode"
                data-testid="theme-toggle"
              >
                {renderThemeIcon()}
              </Button>
            </div>
          </div>

          {/* Row 2: Live Leaderboard */}
          <div className="flex flex-row items-center gap-1 sm:gap-2 overflow-hidden" data-testid="live-leaderboard">
            <span className="text-xl sm:text-3xl font-black text-foreground/50 whitespace-nowrap">Order:</span>
            <div className="flex flex-row gap-1 sm:gap-2">
              {activeLanes.map((lane) => (
                <span
                  key={lane.laneNumber}
                  className={`font-black text-xl sm:text-3xl transition-colors ${getLapColor(lane.count)}`}
                  data-testid={`leaderboard-lane-${lane.laneNumber}`}
                >
                  {lane.laneNumber}
                </span>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* New Race Setup Modal */}
      <Modal
        isOpen={isSetupDialogOpen}
        onClose={() => setSetupDialogOpen(false)}
        data-testid="new-race-setup-dialog"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>New Race Setup</ModalHeader>
              <ModalBody className="flex flex-col gap-4">
                <Select
                  label="Event Selection"
                  selectedKeys={[localEvent]}
                  onSelectionChange={(keys) => {
                    const selected = Array.from(keys)[0] as EventType;
                    if (selected) setLocalEvent(selected);
                  }}
                  data-testid="event-selection-dropdown"
                >
                  <SelectItem key="500 SC">500 SC</SelectItem>
                  <SelectItem key="1000 SC">1000 SC</SelectItem>
                  <SelectItem key="1650 SC">1650 SC</SelectItem>
                  <SelectItem key="800 LC">800 LC</SelectItem>
                  <SelectItem key="1500 LC">1500 LC</SelectItem>
                </Select>

                <Select
                  label="Lanes"
                  selectedKeys={[String(localLaneCount)]}
                  onSelectionChange={(keys) => {
                    const selected = Number(Array.from(keys)[0]);
                    if (!isNaN(selected)) setLocalLaneCount(selected);
                  }}
                  data-testid="lanes-dropdown"
                >
                  <SelectItem key="6">6 lanes</SelectItem>
                  <SelectItem key="8">8 lanes</SelectItem>
                  <SelectItem key="10">10 lanes</SelectItem>
                </Select>

                <div className="flex gap-4">
                  <Input
                    label="Event Number"
                    value={localEventNumber}
                    onValueChange={setLocalEventNumber}
                    placeholder="e.g. 15"
                    data-testid="event-number-input"
                  />
                  <Input
                    label="Heat Number"
                    value={localHeatNumber}
                    onValueChange={setLocalHeatNumber}
                    placeholder="e.g. 2"
                    data-testid="heat-number-input"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose} data-testid="cancel-setup-button">
                  Cancel
                </Button>
                <Button color="primary" onPress={handleStartRace} data-testid="start-race-button">
                  Start Race
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </header>
  );
}
