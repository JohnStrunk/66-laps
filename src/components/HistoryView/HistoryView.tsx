'use client';

import { useBellLapStore, RaceRecord } from "@/modules/bellLapStore";
import { Card, CardBody, ScrollShadow } from "@heroui/react";
import { History } from "lucide-react";
import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

export default function HistoryView() {
  const { history } = useBellLapStore();

  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return <div className="flex-1 bg-background" data-testid="history-view-loading" />;
  }

  return (
    <div className="flex flex-col h-full w-full bg-background" data-testid="history-view">
      <ScrollShadow className="flex-1 p-4">
        {(!history || history.length === 0) ? (
          <div className="flex flex-col items-center justify-center h-full text-default-400 mt-20">
            <History size={48} className="mb-4 opacity-50" />
            <p>No race history recorded yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 pb-safe-bottom">
            {history.map((record: RaceRecord) => (
              <Card key={record.id} className="w-full" data-testid="history-record">
                <CardBody className="flex flex-row items-center justify-between p-3 sm:p-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-lg">{record.event}</span>
                      <span className="text-small text-default-500">
                        {new Date(record.startTime).toLocaleString(undefined, {
                          month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <div className="flex gap-3 text-small text-default-500">
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
