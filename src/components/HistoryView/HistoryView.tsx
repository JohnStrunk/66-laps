'use client';

import { useBellLapStore, RaceRecord } from "@/modules/bellLapStore";
import { Card, CardBody, ScrollShadow } from "@heroui/react";
import { History } from "lucide-react";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export default function HistoryView() {
  const { history, setSelectedRaceId, setView } = useBellLapStore();

  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const handleRecordClick = (id: string) => {
    setSelectedRaceId(id);
    setView('race-details');
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
          <div className="flex flex-col gap-3 pb-safe-bottom">
            {history.map((record: RaceRecord) => (
              <Card
                key={record.id}
                className="w-full"
                isPressable
                onPress={() => handleRecordClick(record.id)}
                data-testid="history-record"
              >
                <CardBody className="flex flex-row items-center justify-between p-3 sm:p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-xl sm:text-2xl">{record.event}</span>
                      <span className="text-base sm:text-lg text-default-500">
                        {new Date(record.startTime).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false
                        })}
                      </span>
                    </div>
                    <div className="flex gap-3 text-base sm:text-lg text-default-500" data-testid="history-record-info">
                      <span>{record.laneCount} Lanes</span>
                      {(record.eventNumber || record.heatNumber) && (
                        <span>
                          {record.eventNumber && `Ev ${record.eventNumber}`}
                          {record.eventNumber && record.heatNumber && ' • '}
                          {record.heatNumber && `Ht ${record.heatNumber}`}
                        </span>
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </ScrollShadow>
    </div>
  );
}
