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
    setMounted(true);
  }, []);

  return (
    <div data-mounted={mounted ? "true" : "false"}>
      <ResponsivePWAWrapper>
        {children}
      </ResponsivePWAWrapper>
    </div>
  );
}
