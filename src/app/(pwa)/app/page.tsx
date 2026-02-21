'use client'

import LaneStack from "@/components/LaneStack/LaneStack";
import BellLapHeader from "@/components/BellLapHeader/BellLapHeader";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { useBellLapStore } from "@/modules/bellLapStore";

function BellLapContent() {
  const searchParams = useSearchParams();
  const setLaneCount = useBellLapStore(state => state.setLaneCount);
  const setSetupDialogOpen = useBellLapStore(state => state.setSetupDialogOpen);
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

  return <LaneStack />;
}

export default function PWALandingPage() {
  return (
    <div className="w-full h-full flex justify-center bg-background overflow-hidden">
      <div
        className="w-full h-full flex flex-col overflow-hidden shadow-2xl bg-transparent"
      >
        <BellLapHeader />
        <main className="flex-1 w-full overflow-hidden p-2" data-testid="pwa-main">
          <Suspense fallback={<div>Loading lanes...</div>}>
            <BellLapContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
