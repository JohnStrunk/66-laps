import { useBellLapStore, RaceRecord, LapEvent, LaneState, EventType } from '../../src/modules/bellLapStore';

export type TestWindow = Window & typeof globalThis & {
  __bellLapStore: typeof useBellLapStore;
};

export type { RaceRecord, LapEvent, LaneState, EventType };
