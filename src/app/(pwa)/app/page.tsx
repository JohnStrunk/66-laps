'use client'

import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Footer/Footer";
import LaneStack from "@/components/LaneStack/LaneStack";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LaneStackContent() {
  const searchParams = useSearchParams();
  // Safe parsing of the 'lanes' query parameter
  const lanesParam = searchParams.get('lanes');
  let laneCount = 8; // Default
  if (lanesParam) {
    const parsed = parseInt(lanesParam, 10);
    if (!isNaN(parsed) && parsed > 0) {
      laneCount = parsed;
    }
  }

  return <LaneStack laneCount={laneCount} />;
}

export default function PWALandingPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Nav />
      <main className="flex flex-col items-center justify-start grow p-4 gap-4">
        <h1 className="text-2xl font-bold my-4">Bell Lap</h1>
        <Suspense fallback={<div>Loading lanes...</div>}>
          <LaneStackContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
