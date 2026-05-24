'use client';

import {
  Button,
  Modal,
  TextField,
  Label,
  Input as HeroUIInput,
  Select,
  ListBox,
} from "@heroui/react";
import { useBellLapStore, EventType } from "@/modules/bellLapStore";
import { useState } from "react";

export default function NewRaceSetupModal({ portalContainer }: { portalContainer?: HTMLElement }) {
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

  return isSetupDialogOpen ? (
    <Modal
      isOpen={true}
      onOpenChange={setSetupDialogOpen}
    >
      <Button className="hidden">Open</Button>
      <Modal.Backdrop className="bg-transparent" />
      <Modal.Container className="fixed inset-0 flex items-center justify-center w-full h-full" {...({ portalContainer } as unknown as Record<string, unknown>)}>
        <Modal.Dialog className="flex items-center justify-center my-auto max-h-screen overflow-y-auto p-8 max-w-md w-full" data-testid="new-race-setup-dialog" aria-label="New Race Setup">
          {({ close }) => (
            <NewRaceSetupModalContent key={contentKey} onClose={close} />
          )}
        </Modal.Dialog>
      </Modal.Container>
    </Modal>
  ) : null;
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
    // Explicitly call onClose to ensure v3 handles exit correctly
    onClose();
  };

  return (
    <>
      <Modal.Header>New Race Setup</Modal.Header>
      <Modal.Body className="flex flex-col gap-4 p-0 w-full">
        <Select className="w-full" selectedKey={localEvent}
          onSelectionChange={(key) => {
            if (key) setLocalEvent(key as EventType);
          }}
          data-testid="event-selection-dropdown"
          aria-label="Event Selection">

          <Label>Event Selection</Label>
          <Select.Trigger aria-label="Event Selection">
            <Select.Value />
          </Select.Trigger>
          <Select.Popover>
            <ListBox aria-label="Event Selection">
              <ListBox.Item id="500 SC" textValue="500 SC">500 SC</ListBox.Item>
              <ListBox.Item id="1000 SC" textValue="1000 SC">1000 SC</ListBox.Item>
              <ListBox.Item id="1650 SC" textValue="1650 SC">1650 SC</ListBox.Item>
              <ListBox.Item id="800 LC" textValue="800 LC">800 LC</ListBox.Item>
              <ListBox.Item id="1500 LC" textValue="1500 LC">1500 LC</ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>

        <Select className="w-full"
          selectedKey={String(localLaneCount)}
          onSelectionChange={(key) => {
            if (key) setLocalLaneCount(Number(key));
          }}
          data-testid="lanes-dropdown"
          aria-label="Lanes">

          <Label>Lanes</Label>
          <Select.Trigger aria-label="Lanes">
            <Select.Value />
          </Select.Trigger>
          <Select.Popover>
            <ListBox aria-label="Lanes">
              <ListBox.Item id="6" textValue="6 lanes">6 lanes</ListBox.Item>
              <ListBox.Item id="8" textValue="8 lanes">8 lanes</ListBox.Item>
              <ListBox.Item id="10" textValue="10 lanes">10 lanes</ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>

        <div className="flex gap-4">
          <TextField
            value={localEventNumber}
            onChange={setLocalEventNumber}
          >
            <Label>Event Number</Label>
            <HeroUIInput placeholder="e.g. 15" data-testid="event-number-input" className="max-w-[8rem]" />
          </TextField>
          <TextField
            value={localHeatNumber}
            onChange={setLocalHeatNumber}
          >
            <Label>Heat Number</Label>
            <HeroUIInput placeholder="e.g. 2" data-testid="heat-number-input" className="max-w-[8rem]" />
          </TextField>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="tertiary" onPress={onClose} data-testid="cancel-setup-button">
          Cancel
        </Button>
        <Button variant="primary" onPress={handleStartRace} data-testid="start-race-button">
          Start Race
        </Button>
      </Modal.Footer>
    </>
  );
}
