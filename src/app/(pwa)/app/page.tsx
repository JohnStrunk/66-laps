'use client'

import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Footer/Footer";
import LaneStack from "@/components/LaneStack/LaneStack";

export default function PWALandingPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Nav />
      <main className="flex flex-col items-center justify-start grow p-4 gap-4">
        <h1 className="text-2xl font-bold my-4">Bell Lap</h1>
        <LaneStack laneCount={8} />
      </main>
      <Footer />
    </div>
  );
}
