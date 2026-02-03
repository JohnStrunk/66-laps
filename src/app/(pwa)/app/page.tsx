'use client'

import Nav from "@/components/Nav/Nav";
import Footer from "@/components/Footer/Footer";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { AppWindow } from "lucide-react";

export default function PWALandingPage() {
  return (
    <div className="w-full flex flex-col min-h-screen">
      <Nav />
      <main className="flex flex-col items-center justify-center grow p-4">
        <Card className="max-w-md w-full p-6 text-center shadow-xl">
          <CardHeader className="flex flex-col items-center gap-2">
            <div className="p-4 bg-primary/10 rounded-full">
              <AppWindow className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">New PWA App</h1>
          </CardHeader>
          <CardBody>
            <p className="text-default-500 mb-6">
              Welcome to the new 66-Laps PWA. This application is currently under development.
            </p>
            <div className="p-4 bg-content2 rounded-lg border-2 border-dashed border-divider">
              <p className="font-mono text-sm">Feature Implementation Coming Soon</p>
            </div>
          </CardBody>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
