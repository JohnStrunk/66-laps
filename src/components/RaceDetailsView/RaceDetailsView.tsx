'use client';

import { useBellLapStore, EVENT_CONFIGS } from "@/modules/bellLapStore";
import {
  Tabs,
  Table
} from "@heroui/react";
import { useMemo, useSyncExternalStore } from "react";
import { TimelineView } from "./TimelineView";

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
    return (
      <div
        className="flex-1 bg-background"
        data-testid="race-details-loading"
        data-mounted={String(mounted)}
        data-has-race={String(!!race)}
        data-selected-id={selectedRaceId || 'none'}
        data-history-count={history.length}
        data-history-ids={history.map(r => r.id).join(',')}
      />
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-background overflow-hidden p-2" data-testid="race-details-view">
      <Tabs aria-label="Race Detail Modes" className="h-full flex flex-col min-h-0">
        <Tabs.List className="shrink-0 mb-2">
          <Tabs.Tab id="lap-oof">OOF by Lap</Tabs.Tab>
          <Tabs.Tab id="timeline">Laps by time</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel id="lap-oof" className="flex-1 min-h-0 overflow-hidden p-0 pt-2 h-full flex flex-col">
          <Table
            aria-label="Lap Order of Finish"
            className="flex-1 min-h-0"
          >
            <Table.ScrollContainer className="h-full overflow-y-auto lap-oof-table-wrapper">
              <Table.Content>
                <Table.Header className="sticky top-0 z-10 bg-background shadow-sm">
                  <Table.Column className="w-[30px]">LAP</Table.Column>
                  <Table.Column>ORDER OF FINISH</Table.Column>
                </Table.Header>
                <Table.Body>
                  {lapOOFData.map((data) => (
                    <Table.Row id={String(data.lap)} key={data.lap} data-testid="lap-row">
                      <Table.Cell className="font-bold text-default-500 text-xs px-1">{data.lap}</Table.Cell>
                      <Table.Cell className="px-1">
                        <div className="flex gap-x-0.5 flex-nowrap items-baseline">
                          {data.lanes.map((laneNum, idx) => (
                            <div key={idx} className="flex gap-x-0.5 items-baseline">
                              <span className="font-bold text-base whitespace-nowrap">
                                {laneNum}
                              </span>
                              {idx < data.lanes.length - 1 && <span className="text-default-300 text-[10px]">|</span>}
                            </div>
                          ))}
                        </div>
                      </Table.Cell>
                    </Table.Row>

                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </Tabs.Panel>

        <Tabs.Panel id="timeline" className="flex-1 min-h-0 overflow-hidden p-0 pt-2 h-full flex flex-col">
          <TimelineView race={race} />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}
