'use client'

import React, { useEffect, useState } from 'react';
import FauxMobileDevice from '../FauxMobileDevice/FauxMobileDevice';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';

export default function ResponsivePWAWrapper({ children }: { children: React.ReactNode }) {
  const [isDesktop, setIsDesktop] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024 && window.innerHeight >= 800);
    };
    checkIsDesktop();
    window.addEventListener('resize', checkIsDesktop);
    return () => {
      cancelAnimationFrame(handle);
      window.removeEventListener('resize', checkIsDesktop);
    };
  }, []);

  if (!mounted) {
    return (
      <div key="unmounted" className="w-full h-dvh bg-background" data-mounted="false">
        {children}
      </div>
    );
  }

  if (isDesktop) {
    return (
      <div key="desktop" className="flex flex-col h-screen w-screen overflow-hidden bg-background" data-mounted="true">
        <div className="shrink-0">
          <Nav />
        </div>
        <main className="flex-1 flex flex-col items-center justify-center overflow-hidden bg-background p-4 sm:p-8">
          <FauxMobileDevice>
            {children}
          </FauxMobileDevice>
          <p className="mt-4 text-center text-foreground/60 font-medium whitespace-pre-line" data-testid="mobile-usage-message">
            Count laps from your phone:{"\n"}
            <span className="text-foreground font-bold">66-laps.com/app</span>
          </p>
        </main>
        <div className="shrink-0">
          <Footer />
        </div>
      </div>
    );
  }

  return (
    <div key="mobile" className="w-full h-dvh overflow-hidden bg-background" data-mounted="true">
      {children}
    </div>
  );
}
