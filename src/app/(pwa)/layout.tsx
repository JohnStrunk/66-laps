'use client';

import ResponsivePWAWrapper from "@/components/ResponsivePWAWrapper/ResponsivePWAWrapper";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export default function PWALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  return (
    <div data-mounted={mounted ? "true" : "false"}>
      <ResponsivePWAWrapper>
        {children}
      </ResponsivePWAWrapper>
    </div>
  );
}
