'use client';

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { useBellLapStore, EventType } from "@/modules/bellLapStore";
import { useState } from "react";

export default function NewRaceSetupModal() {
  const isSetupDialogOpen = useBellLapStore(state => state.isSetupDialogOpen);
  const setSetupDialogOpen = useBellLapStore(state => state.setSetupDialogOpen);

  // Use a key that only changes when the modal OPENS to ensure fresh state,
  // but stays stable while it is CLOSING to avoid interrupting animations.
  const [contentKey, setContentKey] = useState(0);
  const [prevOpen, setPrevOpen] = useState(isSetupDialogOpen);

  if (isSetupDialogOpen && !prevOpen) {
    setPrevOpen(true);
    setContentKey(prev => prev + 1);
  } else if (!isSetupDialogOpen && prevOpen) {
    setPrevOpen(false);
  }

  return (
    <Modal
      isOpen={isSetupDialogOpen}
      onOpenChange={setSetupDialogOpen}
      data-testid="new-race-setup-dialog"
    >
      <ModalContent>
        {(onClose) => (
          <NewRaceSetupModalContent key={contentKey} onClose={onClose} />
        )}
      </ModalContent>
    </Modal>
  );
}

function NewRaceSetupModalContent({ onClose }: { onClose: () => void }) {
  const event = useBellLapStore(state => state.event);
  const laneCount = useBellLapStore(state => state.laneCount);
  const eventNumber = useBellLapStore(state => state.eventNumber);
  const heatNumber = useBellLapStore(state => state.heatNumber);
  const startRace = useBellLapStore(state => state.startRace);

  // Local state for the dialog - initialized from store when component mounts
  const [localEvent, setLocalEvent] = useState<EventType>(event);
  const [localLaneCount, setLocalLaneCount] = useState<number>(laneCount);
  const [localEventNumber, setLocalEventNumber] = useState<string>(eventNumber);
  const [localHeatNumber, setLocalHeatNumber] = useState<string>(heatNumber);

  const handleStartRace = () => {
    startRace(localEvent, localLaneCount, localEventNumber, localHeatNumber);
    // Note: onClose() is NOT called here because startRace already sets isSetupDialogOpen to false
    // which triggers the Modal to close via its isOpen prop.
  };

  return (
    <>
      <ModalHeader>New Race Setup</ModalHeader>
      <ModalBody className="flex flex-col gap-4">
        <Select
          label="Event Selection"
          selectedKeys={[localEvent]}
          onSelectionChange={(keys) => {
            const selected = Array.from(keys)[0] as EventType;
            if (selected) setLocalEvent(selected);
          }}
          data-testid="event-selection-dropdown"
        >
          <SelectItem key="500 SC">500 SC</SelectItem>
          <SelectItem key="1000 SC">1000 SC</SelectItem>
          <SelectItem key="1650 SC">1650 SC</SelectItem>
          <SelectItem key="800 LC">800 LC</SelectItem>
          <SelectItem key="1500 LC">1500 LC</SelectItem>
        </Select>

        <Select
          label="Lanes"
          selectedKeys={[String(localLaneCount)]}
          onSelectionChange={(keys) => {
            const selected = Number(Array.from(keys)[0]);
            if (!isNaN(selected)) setLocalLaneCount(selected);
          }}
          data-testid="lanes-dropdown"
        >
          <SelectItem key="6">6 lanes</SelectItem>
          <SelectItem key="8">8 lanes</SelectItem>
          <SelectItem key="10">10 lanes</SelectItem>
        </Select>

        <div className="flex gap-4">
          <Input
            label="Event Number"
            value={localEventNumber}
            onValueChange={setLocalEventNumber}
            placeholder="e.g. 15"
            data-testid="event-number-input"
          />
          <Input
            label="Heat Number"
            value={localHeatNumber}
            onValueChange={setLocalHeatNumber}
            placeholder="e.g. 2"
            data-testid="heat-number-input"
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button variant="light" onPress={onClose} data-testid="cancel-setup-button">
          Cancel
        </Button>
        <Button color="primary" onPress={handleStartRace} data-testid="start-race-button">
          Start Race
        </Button>
      </ModalFooter>
    </>
  );
}
