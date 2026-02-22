'use client';

import { useBellLapStore, EVENT_CONFIGS } from "@/modules/bellLapStore";
import {
  Tabs,
  Tab,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell
} from "@heroui/react";
import { useMemo, useSyncExternalStore } from "react";

const subscribe = () => () => {};

export default function RaceDetailsView() {
  const { history, selectedRaceId } = useBellLapStore();

  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  const race = useMemo(() => {
    return history.find(r => r.id === selectedRaceId);
  }, [history, selectedRaceId]);

  const lapOOFData = useMemo(() => {
    if (!race) return [];

    const config = EVENT_CONFIGS[race.event];
    const maxLaps = config.laps;
    const laps = [];
    for (let i = 2; i <= maxLaps; i += 2) {
      laps.push(i);
    }

    return laps.map(lapNum => {
      const laneTimes: { laneNumber: number, timestamp: number }[] = [];

      race.lanes.forEach(lane => {
        // Find the latest event where this lane completed this lap
        // Completion means newCount >= lapNum AND prevCount < lapNum
        const completions = lane.events.filter(e => e.newCount >= lapNum && e.prevCount < lapNum);
        if (completions.length > 0) {
          const latestCompletion = completions.reduce((latest, current) =>
            current.timestamp > latest.timestamp ? current : latest
          );
          laneTimes.push({
            laneNumber: lane.laneNumber,
            timestamp: latestCompletion.timestamp
          });
        }
      });

      // Sort lanes by timestamp
      laneTimes.sort((a, b) => a.timestamp - b.timestamp);

      return {
        lap: lapNum,
        lanes: laneTimes.map(lt => lt.laneNumber)
      };
    });
  }, [race]);

  if (!mounted || !race) {
    return <div className="flex-1 bg-background" data-testid="race-details-loading" />;
  }

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden p-2" data-testid="race-details-view">
      <Tabs
        aria-label="Race Detail Modes"
        classNames={{
          base: "shrink-0",
          panel: "flex-1 min-h-0 overflow-hidden p-0 pt-2",
          tabList: "mb-2"
        }}
        fullWidth
      >
        <Tab key="lap-oof" title="Lap OOF" className="h-full flex flex-col min-h-0">
                              <Table
                                aria-label="Lap Order of Finish"
                                isHeaderSticky
                                classNames={{
                                  base: "flex-1 min-h-0",
                                  wrapper: "h-full overflow-y-auto lap-oof-table-wrapper",
                                  table: "min-w-full",
                                  th: "px-1 py-2 text-xs",
                                  td: "px-1 py-2"
                                }}
                              >
                                <TableHeader>
                                  <TableColumn width={30}>LAP</TableColumn>
                                  <TableColumn>ORDER OF FINISH</TableColumn>
                                </TableHeader>
                                                        <TableBody>
                                                          {lapOOFData.map((data) => (
                                                            <TableRow key={data.lap} data-testid="lap-row">
                                                              <TableCell className="font-bold text-default-500 text-sm">{data.lap}</TableCell>
                                                              <TableCell>
                                                                <div className="flex gap-x-1 flex-nowrap items-baseline">
                                                                  {data.lanes.map((laneNum, idx) => (
                                                                    <div key={idx} className="flex gap-x-0.5 items-baseline">
                                                                      <span className="font-bold text-lg whitespace-nowrap">
                                                                        {laneNum}
                                                                      </span>
                                                                      {idx < data.lanes.length - 1 && <span className="text-default-300 text-xs">|</span>}
                                                                    </div>
                                                                  ))}
                                                                </div>
                                                              </TableCell>
                                                            </TableRow>
                                                          ))}
                                                        </TableBody>
                                                                          </Table>
                            </Tab>
      </Tabs>
    </div>
  );
}
