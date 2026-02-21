'use client';

import ResponsivePWAWrapper from "@/components/ResponsivePWAWrapper/ResponsivePWAWrapper";
import { useEffect, useState } from "react";

export default function PWALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(handle);
  }, []);

  return (
    <div data-mounted={mounted ? "true" : "false"}>
      <ResponsivePWAWrapper>
        {children}
      </ResponsivePWAWrapper>
    </div>
  );
}
