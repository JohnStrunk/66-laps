'use client';

import { useBellLapStore, RaceRecord } from "@/modules/bellLapStore";
import { downloadRacePDF, shareRacePDF } from "@/modules/pdfGenerator";
import {
  Button,
  Card,
  CardBody,
  ScrollShadow,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@heroui/react";
import { History, Share2, Download, Trash2 } from "lucide-react";
import { useSyncExternalStore, useState } from "react";

const subscribe = () => () => {};

export default function HistoryView() {
  const { history, setSelectedRaceId, setView, deleteRace, clearHistory } = useBellLapStore();
  const [raceToDelete, setRaceToDelete] = useState<RaceRecord | null>(null);
  const {
    isOpen: isDeleteAllOpen,
    onOpen: onDeleteAllOpen,
    onOpenChange: onDeleteAllOpenChange
  } = useDisclosure();

  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const handleRecordClick = (id: string) => {
    setSelectedRaceId(id);
    setView('race-details');
  };

  const handleDownload = async (e: React.MouseEvent, record: RaceRecord) => {
    e.stopPropagation();
    await downloadRacePDF(record);
  };

  const handleShare = async (e: React.MouseEvent, record: RaceRecord) => {
    e.stopPropagation();
    await shareRacePDF(record);
  };

  const handleDeleteClick = (e: React.MouseEvent, record: RaceRecord) => {
    e.stopPropagation();
    setRaceToDelete(record);
  };

  const confirmDelete = () => {
    if (raceToDelete) {
      deleteRace(raceToDelete.id);
      setRaceToDelete(null);
    }
  };

  const confirmDeleteAll = () => {
    clearHistory();
    onDeleteAllOpenChange();
  };

  if (!mounted) {
    return <div className="flex-1 bg-background" data-testid="history-view-loading" />;
  }

  return (
    <div className="flex flex-col h-full w-full bg-background" data-testid="history-view">
      <ScrollShadow className="flex-1 p-4 flex flex-col">
        {(!history || history.length === 0) ? (
          <div className="flex flex-col items-center justify-center flex-1 text-default-400">
            <History size={48} className="mb-4 opacity-50" />
            <p>No race history recorded yet.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {history.map((record: RaceRecord) => (
                <Card
                  key={record.id}
                  className="w-full"
                  data-testid="history-record"
                >
                  <CardBody className="flex flex-row items-center justify-between p-0">
                    <div
                      className="flex-1 flex flex-col gap-1 p-3 sm:p-4 cursor-pointer hover:bg-default-100 transition-colors"
                      onClick={() => handleRecordClick(record.id)}
                      role="button"
                      tabIndex={0}
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-xl sm:text-2xl">{record.event}</span>
                        <span className="text-base sm:text-lg text-default-500">
                          {new Date(record.startTime).toLocaleString(undefined, {
                            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex gap-3 text-base sm:text-lg text-default-500" data-testid="history-record-info">
                        <span>{record.laneCount} Lanes</span>
                        {(record.eventNumber || record.heatNumber) && (
                          <span>
                            {record.eventNumber && `E ${record.eventNumber}`}
                            {record.eventNumber && record.heatNumber && ' • '}
                            {record.heatNumber && `H ${record.heatNumber}`}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1 pr-2 sm:pr-3">
                      <Tooltip content="Share PDF">
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          onClick={(e) => {
                              e.stopPropagation();
                              void handleShare(e as unknown as React.MouseEvent, record);
                          }}
                          aria-label="Share"
                          data-testid="share-history-button"
                        >
                          <Share2 size={20} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Download PDF">
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          onClick={(e) => {
                              e.stopPropagation();
                              void handleDownload(e as unknown as React.MouseEvent, record);
                          }}
                          aria-label="Download"
                          data-testid="download-history-button"
                        >
                          <Download size={20} />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Delete Race">
                        <Button
                          isIconOnly
                          variant="light"
                          color="danger"
                          size="sm"
                          onClick={(e) => handleDeleteClick(e as unknown as React.MouseEvent, record)}
                          aria-label="Delete"
                          data-testid="delete-history-button"
                        >
                          <Trash2 size={20} />
                        </Button>
                      </Tooltip>
                    </div>
                  </CardBody>
                </Card>
              ))}
            </div>
            <div className="mt-6 mb-8 flex justify-center pb-safe-bottom">
              <Button
                color="danger"
                variant="flat"
                startContent={<Trash2 size={18} />}
                onClick={onDeleteAllOpen}
                data-testid="delete-all-history-button"
              >
                Delete all
              </Button>
            </div>
          </>
        )}
      </ScrollShadow>

      {/* Delete Single Race Modal */}
      <Modal isOpen={!!raceToDelete} onOpenChange={() => setRaceToDelete(null)}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete Race</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete this race record?</p>
                {raceToDelete && (
                  <div className="p-3 bg-default-100 rounded-lg">
                    <p className="font-bold">{raceToDelete.event}</p>
                    <p className="text-sm text-default-500">
                      {new Date(raceToDelete.startTime).toLocaleString()}
                    </p>
                  </div>
                )}
                <p className="text-danger text-sm">This action cannot be undone.</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  data-testid="cancel-delete-button"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={confirmDelete}
                  data-testid="confirm-delete-button"
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      {/* Delete All History Modal */}
      <Modal isOpen={isDeleteAllOpen} onOpenChange={onDeleteAllOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Delete All History</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to delete <b>all</b> race history?</p>
                <p className="text-danger text-sm">This will permanently remove all {history.length} records. This action cannot be undone.</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  data-testid="cancel-delete-all-button"
                >
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={confirmDeleteAll}
                  data-testid="confirm-delete-all-button"
                >
                  Delete All
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}
