'use client'

import Footer from "@/components/Footer/Footer";
import LaneStack from "@/components/LaneStack/LaneStack";
import BellLapHeader from "@/components/BellLapHeader/BellLapHeader";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { useBellLapStore } from "@/modules/bellLapStore";

function BellLapContent() {
  const searchParams = useSearchParams();
  const setLaneCount = useBellLapStore(state => state.setLaneCount);
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
    initialized.current = true;
  }, [searchParams, setLaneCount]);

  return <LaneStack />;
}

export default function PWALandingPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <BellLapHeader />
      <main className="flex flex-col items-center justify-start grow p-4 gap-4">
        <Suspense fallback={<div>Loading lanes...</div>}>
          <BellLapContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
