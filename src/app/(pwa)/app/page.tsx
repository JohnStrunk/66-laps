'use client'

import LaneStack from "@/components/LaneStack/LaneStack";
import BellLapHeader from "@/components/BellLapHeader/BellLapHeader";
import MainMenu from "@/components/MainMenu/MainMenu";
import HistoryView from "@/components/HistoryView/HistoryView";
import RaceDetailsView from "@/components/RaceDetailsView/RaceDetailsView";
import NewRaceSetupModal from "@/components/NewRaceSetupModal/NewRaceSetupModal";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { useBellLapStore } from "@/modules/bellLapStore";

function BellLapContent() {
  const searchParams = useSearchParams();
  const setLaneCount = useBellLapStore(state => state.setLaneCount);
  const setSetupDialogOpen = useBellLapStore(state => state.setSetupDialogOpen);
  const view = useBellLapStore(state => state.view);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
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
  }, [searchParams, setLaneCount, setSetupDialogOpen]);

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
  return (
    <div className="w-full h-full flex justify-center bg-background overflow-hidden">
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
