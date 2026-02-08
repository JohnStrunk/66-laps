import ResponsivePWAWrapper from "@/components/ResponsivePWAWrapper/ResponsivePWAWrapper";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "66 Laps",
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function PWALayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ResponsivePWAWrapper>
      {children}
    </ResponsivePWAWrapper>
  );
}
