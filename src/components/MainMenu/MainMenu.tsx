'use client';

import { Button } from "@heroui/react";
import { useBellLapStore } from "@/modules/bellLapStore";
import { Play, History, HelpCircle } from "lucide-react";

export default function MainMenu() {
  const { setSetupDialogOpen, setView } = useBellLapStore();

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full p-4 gap-6 bg-background">
      <div className="absolute top-8 flex flex-col items-center gap-2">
        <p className="text-default-500 text-lg">Main menu</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button
          color="primary"
          variant="solid"
          size="lg"
          startContent={<Play size={24} />}
          className="w-full font-semibold text-lg py-6"
          onPress={() => setSetupDialogOpen(true)}
          data-testid="new-race-button"
        >
          New Race
        </Button>

        <Button
          color="default"
          variant="flat"
          size="lg"
          startContent={<History size={24} />}
          className="w-full font-semibold text-lg py-6"
          onPress={() => setView('history')}
          data-testid="history-button"
        >
          History
        </Button>

        <Button
          color="default"
          variant="flat"
          size="lg"
          startContent={<HelpCircle size={24} />}
          className="w-full font-semibold text-lg py-6"
          onPress={() => setView('help')}
          data-testid="help-button"
        >
          Help
        </Button>
      </div>

      <div className="absolute bottom-4 left-0 right-0 flex justify-center pb-safe-bottom">
        <a
          href="mailto:feedback@66-laps.com"
          className="text-default-400 hover:text-primary transition-colors text-base font-medium underline underline-offset-4"
          data-testid="feedback-link"
        >
          Send feedback
        </a>
      </div>
    </div>
  );
}
