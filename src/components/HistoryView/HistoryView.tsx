'use client';

import { useBellLapStore, RaceRecord } from "@/modules/bellLapStore";
import { downloadRacePDF, shareRacePDF } from "@/modules/pdfGenerator";
import {
  Button,
  Card,
  ScrollShadow,
  Tooltip,
  Modal
} from "@heroui/react";
import { History, Share2, Download, Trash2 } from "lucide-react";
import { useSyncExternalStore, useState } from "react";

const subscribe = () => () => {};

export default function HistoryView() {
  const { history, setSelectedRaceId, setView, deleteRace, clearHistory } = useBellLapStore();
  const [raceToDelete, setRaceToDelete] = useState<RaceRecord | null>(null);
  const [isDeleteAllOpen, setIsDeleteAllOpen] = useState(false);


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
    setIsDeleteAllOpen(false);
  };

  if (!mounted) {
    return <div className="flex-1 bg-background" data-testid="history-view-loading" />;
  }

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden p-2" data-testid="history-view">
      <ScrollShadow className="flex-1 min-h-0 px-2 py-4">
        {history.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-4 text-default-400">
            <History size={64} opacity={0.2} />
            <p className="text-xl font-medium">No race history recorded yet.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {history.map((record: RaceRecord) => (
                <Card
  key={record.id}
  className="w-full shadow-sm hover:shadow-md transition-shadow bg-content1 cursor-pointer truncate"
  onClick={() => handleRecordClick(record.id)}
  data-testid="history-record"
  title={`${record.event} ${new Date(record.startTime).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`}
>
                  <div className="flex flex-col p-0">
                    <div
                      className="flex-1 flex flex-col gap-1 p-3 sm:p-4 hover:bg-default-100 transition-colors"
                      role="button"
                      tabIndex={0}
                      aria-label={`Race: ${record.event}, ${new Date(record.startTime).toLocaleString()}`}
                    >
                      <div className="flex items-baseline gap-2 overflow-hidden whitespace-nowrap truncate text-base sm:text-lg" data-testid="history-record-info" title={`${record.event} ${new Date(record.startTime).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`}>
                        <span className="font-bold text-base sm:text-lg">{record.event}</span>
                        <span className="text-xs sm:text-sm text-default-500">
                          {new Date(record.startTime).toLocaleString(undefined, {
                            month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 pr-2 sm:pr-3">
                        {/* Event Number */}
                        {record.eventNumber && (
                          <span className="text-sm text-default-500">E {record.eventNumber}</span>
                        )}
                        {/* Heat Number */}
                        {record.heatNumber && (
                          <span className="text-sm text-default-500">H {record.heatNumber}</span>
                        ) }
                      {record.laneCount && (<span className="text-sm text-default-500">Lanes {record.laneCount}</span>)}
                        {/* Action Buttons */}
                        <div className="flex gap-2 ml-auto">
                          <Tooltip>
                            <Button
                              isIconOnly
                              variant="ghost"
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
                            <Tooltip.Content>Share PDF</Tooltip.Content>
                          </Tooltip>
                          <Tooltip>
                            <Button
                              isIconOnly
                              variant="ghost"
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
                            <Tooltip.Content>Download PDF</Tooltip.Content>
                          </Tooltip>
                          <Tooltip>
                            <Button
                              isIconOnly
                              variant="ghost"
                              className="text-danger"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(e as unknown as React.MouseEvent, record);
                              }}
                              aria-label="Delete"
                              data-testid="delete-history-button"
                            >
                              <Trash2 size={20} />
                            </Button>
                            <Tooltip.Content>Delete Race</Tooltip.Content>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-6 mb-8 flex justify-center pb-safe-bottom">
              <Button
                variant="danger-soft"
                onPress={() => setIsDeleteAllOpen(true)}
                data-testid="delete-all-history-button"
              >
                <Trash2 size={18} className="mr-2" />
                Delete all
              </Button>
            </div>
          </>
        )}
      </ScrollShadow>

      {/* Delete Single Race Modal */}
      {!!raceToDelete && (
        <Modal isOpen={true} onOpenChange={(isOpen) => !isOpen && setRaceToDelete(null)}>
          <Button className="hidden">Open</Button>
          <Modal.Backdrop className="bg-transparent" />
          <Modal.Container className="fixed inset-0 flex items-center justify-center w-full h-full">
            <Modal.Dialog className="flex items-center justify-center my-auto max-h-screen overflow-y-auto" data-testid="delete-race-dialog" aria-label="Delete Race">
              {({ close }) => (
                <>
                  <Modal.Header className="flex flex-col gap-1">
                    <header>Delete Race</header>
                  </Modal.Header>
                  <Modal.Body className="p-0">
                    <p>Are you sure you want to delete this race record?</p>
                    <div className="p-3 bg-default-100 rounded-lg">
                      <p className="font-bold">{raceToDelete.event}</p>
                      <p className="text-sm text-default-500">
                        {new Date(raceToDelete.startTime).toLocaleString()}
                      </p>
                    </div>
                    <p className="text-danger text-sm">This action cannot be undone.</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="tertiary"
                      onPress={close}
                      data-testid="cancel-delete-button"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      onPress={confirmDelete}
                      data-testid="confirm-delete-button"
                    >
                      Delete
                    </Button>
                  </Modal.Footer>
                </>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal>
      )}

      {/* Delete All History Modal */}
      {isDeleteAllOpen && (
        <Modal isOpen={true} onOpenChange={setIsDeleteAllOpen}>
          <Button className="hidden">Open</Button>
          <Modal.Container>
            <Modal.Dialog data-testid="delete-all-dialog" aria-label="Delete All History">
              {({ close }) => (
                <>
                  <Modal.Header className="flex flex-col gap-1">
                    <header>Delete All History</header>
                  </Modal.Header>
                  <Modal.Body>
                    <p>Are you sure you want to delete <b>all</b> race history?</p>
                    <p className="text-danger text-sm">This will permanently remove all {history.length} records. This action cannot be undone.</p>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button
                      variant="tertiary"
                      onPress={close}
                      data-testid="cancel-delete-all-button"
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="danger"
                      onPress={confirmDeleteAll}
                      data-testid="confirm-delete-all-button"
                    >
                      Delete All
                    </Button>
                  </Modal.Footer>
                </>
              )}
            </Modal.Dialog>
          </Modal.Container>
        </Modal>
      )}
    </div>
  );
}
