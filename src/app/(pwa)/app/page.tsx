'use client'

import LaneStack from "@/components/LaneStack/LaneStack";
import BellLapHeader from "@/components/BellLapHeader/BellLapHeader";
import MainMenu from "@/components/MainMenu/MainMenu";
import HistoryView from "@/components/HistoryView/HistoryView";
import RaceDetailsView from "@/components/RaceDetailsView/RaceDetailsView";
import NewRaceSetupModal from "@/components/NewRaceSetupModal/NewRaceSetupModal";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useSyncExternalStore } from "react";
import { useBellLapStore } from "@/modules/bellLapStore";

const subscribe = () => () => {};

function BellLapContent() {
  const searchParams = useSearchParams();
  const setLaneCount = useBellLapStore(state => state.setLaneCount);
  const setSetupDialogOpen = useBellLapStore(state => state.setSetupDialogOpen);
  const setView = useBellLapStore(state => state.setView);
  const setSelectedRaceId = useBellLapStore(state => state.setSelectedRaceId);
  const exitRace = useBellLapStore(state => state.exitRace);
  const view = useBellLapStore(state => state.view);
  const selectedRaceId = useBellLapStore(state => state.selectedRaceId);
  const initialized = useRef(false);
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const lastState = useRef<{ view: string, selectedRaceId: string | null } | null>(null);
  const isPopStateRef = useRef(false);

  useEffect(() => {
    if (!mounted || initialized.current) return;

    // Ensure initial state is set before we do anything else
    if (typeof window !== 'undefined') {
      if (!window.history.state || !window.history.state.view) {
        window.history.replaceState({ view: 'main-menu', selectedRaceId: null }, '');
      } else if (window.history.state.view) {
        setView(window.history.state.view);
        setSelectedRaceId(window.history.state.selectedRaceId || null);
      }
      lastState.current = {
        view: window.history.state?.view || 'main-menu',
        selectedRaceId: window.history.state?.selectedRaceId || null
      };
    }

    const lanesParam = searchParams.get('lanes');
    if (lanesParam) {
      const parsed = parseInt(lanesParam, 10);
      if (!isNaN(parsed) && parsed > 0) {
        setLaneCount(parsed);
      }
    }

    const testMode = searchParams.get('testMode');
    if (testMode === 'true') {
      setSetupDialogOpen(false);
    }

    initialized.current = true;
  }, [mounted, searchParams, setLaneCount, setSetupDialogOpen, view, selectedRaceId, setView, setSelectedRaceId]);

  // Handle browser back/forward buttons
  useEffect(() => {
    if (!mounted) return;
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.view) {
        // If we are currently in a race and navigating away, save it
        if (useBellLapStore.getState().view === 'race' && event.state.view !== 'race') {
          exitRace({ skipViewChange: true });
        }

        isPopStateRef.current = true;
        lastState.current = {
          view: event.state.view,
          selectedRaceId: event.state.selectedRaceId || null
        };
        setView(event.state.view);
        setSelectedRaceId(event.state.selectedRaceId || null);
        // Reset the ref in the next tick after state updates have been triggered
        setTimeout(() => {
          isPopStateRef.current = false;
        }, 0);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [mounted, setView, setSelectedRaceId, exitRace]);

  // Push to history when view/race selection changes from within the app
  useEffect(() => {
    if (!lastState.current || isPopStateRef.current) return;

    const hasChanged = view !== lastState.current.view ||
                      selectedRaceId !== lastState.current.selectedRaceId;

    if (hasChanged) {
      window.history.pushState({ view, selectedRaceId }, '');
      lastState.current = { view, selectedRaceId };
    }
  }, [view, selectedRaceId]);

  if (view === 'main-menu') {
    return <MainMenu />;
  }

  if (view === 'history') {
    return <HistoryView />;
  }

  if (view === 'race-details') {
    return <RaceDetailsView />;
  }

  return <LaneStack />;
}

export default function PWALandingPage() {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);

  return (
    <div
      className="w-full h-full flex justify-center bg-background overflow-hidden"
      data-mounted={mounted ? "true" : "false"}
    >
      <div
        className="w-full h-full flex flex-col overflow-hidden shadow-2xl bg-transparent"
      >
        <BellLapHeader />
        <main className="flex-1 min-h-0 w-full overflow-hidden p-2" data-testid="pwa-main">
          <Suspense fallback={<div>Loading...</div>}>
            <BellLapContent />
          </Suspense>
        </main>
        <NewRaceSetupModal />
      </div>
    </div>
  );
}
