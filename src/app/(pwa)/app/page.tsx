'use client'

import LaneStack from "@/components/LaneStack/LaneStack";
import BellLapHeader from "@/components/BellLapHeader/BellLapHeader";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
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
  const [maxWidth, setMaxWidth] = useState<string>('448px');

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setMaxWidth('none');
      } else {
        setMaxWidth('448px');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleFullscreen = () => {
      const isSmallDevice = window.innerWidth <= 768 || window.innerHeight <= 768;
      if (isSmallDevice && document.documentElement.requestFullscreen && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {
          // Silently fail as it often requires a user gesture
        });
      }
    };

    handleFullscreen();
    window.addEventListener('click', handleFullscreen, { once: true });
    return () => window.removeEventListener('click', handleFullscreen);
  }, []);

  return (
    <div className="w-full h-dvh flex justify-center bg-background overflow-hidden">
      <div
        style={{ maxWidth }}
        className="w-full h-full flex flex-col overflow-hidden border-x shadow-2xl transition-all duration-300"
      >
        <BellLapHeader />
        <main className="flex-1 w-full overflow-hidden p-2">
          <Suspense fallback={<div>Loading lanes...</div>}>
            <BellLapContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
