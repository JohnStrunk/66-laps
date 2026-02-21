'use client';

import { Button } from "@heroui/react";
import { useBellLapStore } from "@/modules/bellLapStore";
import { Play, History } from "lucide-react";

export default function MainMenu() {
  const { setSetupDialogOpen, setView } = useBellLapStore();

  return (
    <div className="flex flex-col items-center justify-center h-full w-full p-4 gap-6 bg-background">
      <div className="flex flex-col items-center gap-2 mb-8">
        <p className="text-default-500 text-lg">Main menu</p>
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        <Button
          color="primary"
          size="lg"
          startContent={<Play size={24} />}
          className="w-full font-semibold text-lg py-6"
          onPress={() => setSetupDialogOpen(true)}
          data-testid="new-race-button"
        >
          New Race
        </Button>

        <Button
          variant="faded"
          size="lg"
          startContent={<History size={24} />}
          className="w-full font-semibold text-lg py-6"
          onPress={() => setView('history')}
          data-testid="history-button"
        >
          History
        </Button>
      </div>
    </div>
  );
}
