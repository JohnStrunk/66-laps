'use client';

import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Card,
  CardBody,
  Tooltip,
} from "@heroui/react";
import { useBellLapStore, EVENT_CONFIGS } from "@/modules/bellLapStore";
import { downloadRacePDF, shareRacePDF } from "@/modules/pdfGenerator";
import { ChevronDown, Moon, Sun, SunMoon, DoorOpen, ArrowLeft, Share2, Download } from "lucide-react";
import { useMemo, useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { usePostHog } from "posthog-js/react";
import { ph_event_set_theme } from "@/modules/phEvents";

const subscribe = () => () => {};

export default function BellLapHeader() {
  const {
    view,
    event,
    laneCount,
    eventNumber,
    heatNumber,
    isFlipped,
    setIsFlipped,
    exitRace,
    lanes,
    history,
    selectedRaceId,
  } = useBellLapStore();

  const { theme, setTheme } = useTheme();
  const postHog = usePostHog();

  const selectedRace = useMemo(() => {
    return history.find(r => r.id === selectedRaceId);
  }, [history, selectedRaceId]);

  // Modern idiomatic way to handle "is client" for hydration
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

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
    if (count >= (EVENT_CONFIGS[event]?.laps || 20)) return "text-success";
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

  const handleBackToHistory = () => {
    window.history.back();
  };

  const handleExit = () => {
    exitRace({ skipViewChange: true });
    window.history.back();
  };

  const safeLaneCount = typeof laneCount === 'number' && !isNaN(laneCount) ? laneCount : 8;

  if (view === 'main-menu') {
    return (
      <header
        className="z-50 p-2 pb-0"
        style={{ paddingTop: 'calc(var(--simulated-safe-area-top, env(safe-area-inset-top, 0px)) + 0.5rem)' }}
        data-testid="bell-lap-header"
      >
        <Card className="shadow-md bg-content1">
          <CardBody className="flex flex-row items-center justify-between p-2 sm:p-3">
            <h1 className="text-xl font-bold px-2">66 Laps</h1>
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
          </CardBody>
        </Card>
      </header>
    );
  }

  if (view === 'history') {
    return (
      <header
        className="z-50 p-2 pb-0"
        style={{ paddingTop: 'calc(var(--simulated-safe-area-top, env(safe-area-inset-top, 0px)) + 0.5rem)' }}
        data-testid="bell-lap-header"
      >
        <Card className="shadow-md bg-content1">
          <CardBody className="flex flex-row items-center justify-between p-2 sm:p-3">
            <div className="flex items-center gap-2">
              <Button
                isIconOnly
                variant="flat"
                size="sm"
                onPress={handleExit}
                aria-label="Back to Main Menu"
                data-testid="exit-history-button"
              >
                <ArrowLeft size={18} />
              </Button>
              <h1 className="text-xl font-bold px-2">Race History</h1>
            </div>
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
          </CardBody>
        </Card>
      </header>
    );
  }

  if (view === 'race-details') {
    return (
      <header
        className="z-50 p-2 pb-0"
        style={{ paddingTop: 'calc(var(--simulated-safe-area-top, env(safe-area-inset-top, 0px)) + 0.5rem)' }}
        data-testid="bell-lap-header"
      >
        <Card className="shadow-md bg-content1">
          <CardBody className="flex flex-col gap-1 p-2 sm:p-3">
            <div className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2 overflow-hidden">
                <Button
                  isIconOnly
                  variant="flat"
                  size="sm"
                  onPress={handleBackToHistory}
                  aria-label="Back to History"
                  data-testid="back-to-history-button"
                >
                  <ArrowLeft size={18} />
                </Button>
                <div className="flex flex-row items-center gap-x-2 overflow-hidden text-base sm:text-lg font-bold whitespace-nowrap" data-testid="header-race-info">
                  <span>{selectedRace ? selectedRace.event : 'Race Details'}</span>
                  {selectedRace?.eventNumber && <span className="text-default-300 font-normal">|</span>}
                  {selectedRace?.eventNumber && <span className="whitespace-nowrap">E {selectedRace.eventNumber}</span>}
                  {selectedRace?.heatNumber && <span className="text-default-300 font-normal">|</span>}
                  {selectedRace?.heatNumber && <span className="whitespace-nowrap">H {selectedRace.heatNumber}</span>}
                </div>
              </div>
              <div className="flex gap-1">
                {selectedRace && (
                  <>
                    <Tooltip content="Share PDF">
                      <Button
                        isIconOnly
                        variant="flat"
                        size="sm"
                        onPress={() => shareRacePDF(selectedRace)}
                        aria-label="Share"
                        data-testid="share-history-button"
                      >
                        <Share2 size={18} />
                      </Button>
                    </Tooltip>
                    <Tooltip content="Download PDF">
                      <Button
                        isIconOnly
                        variant="flat"
                        size="sm"
                        onPress={() => downloadRacePDF(selectedRace)}
                        aria-label="Download"
                        data-testid="download-history-button"
                      >
                        <Download size={18} />
                      </Button>
                    </Tooltip>
                  </>
                )}
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
          </CardBody>
        </Card>
      </header>
    );
  }

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
              <Button
                isIconOnly
                variant="flat"
                size="sm"
                onPress={handleExit}
                aria-label="Back to Main Menu"
                data-testid="exit-button"
              >
                <ArrowLeft size={18} />
              </Button>
              <span className="font-bold whitespace-nowrap text-small sm:text-medium" data-testid="header-event-name">{event}</span>
              {eventNumber && <span className="text-xs sm:text-sm text-foreground/70 whitespace-nowrap" data-testid="header-event-number">E {eventNumber}</span>}
              {heatNumber && <span className="text-xs sm:text-sm text-foreground/70 whitespace-nowrap" data-testid="header-heat-number">H {heatNumber}</span>}
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
    </header>
  );
}
