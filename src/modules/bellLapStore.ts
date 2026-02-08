import { create } from 'zustand';

export type EventType = '500 SC' | '1000 SC' | '1650 SC' | '800 LC' | '1500 LC';

interface EventConfig {
  laps: number;
  lockout: number;
}

export const EVENT_CONFIGS: Record<EventType, EventConfig> = {
  '500 SC': { laps: 20, lockout: 15 },
  '1000 SC': { laps: 40, lockout: 15 },
  '1650 SC': { laps: 66, lockout: 15 },
  '800 LC': { laps: 16, lockout: 30 },
  '1500 LC': { laps: 30, lockout: 30 },
};

export interface LaneState {
  laneNumber: number;
  count: number;
  isEmpty: boolean;
  history: number[]; // timestamps of touches
}

export interface BellLapState {
  event: EventType;
  laneCount: number;
  isFlipped: boolean;
  lanes: LaneState[];
  isResetModalOpen: boolean;

  // Actions
  setEvent: (event: EventType) => void;
  setLaneCount: (count: number) => void;
  toggleFlip: () => void;
  setIsFlipped: (isFlipped: boolean) => void;
  updateLaneCount: (laneNumber: number, delta: number) => void;
  setLaneCountValue: (laneNumber: number, count: number) => void;
  toggleLaneEmpty: (laneNumber: number) => void;
  registerTouch: (laneNumber: number, ignoreLockout?: boolean) => void;
  resetRace: () => void;
  setResetModalOpen: (open: boolean) => void;
}

const createDefaultLanes = (count: number): LaneState[] =>
  Array.from({ length: count }, (_, i) => ({
    laneNumber: i + 1,
    count: 0,
    isEmpty: false,
    history: [],
  }));

export const useBellLapStore = create<BellLapState>((set) => ({
  event: '500 SC',
  laneCount: 8,
  isFlipped: false,
  lanes: createDefaultLanes(8),
  isResetModalOpen: false,

  setEvent: (event) => set({ event }),

  setLaneCount: (laneCount) => set((state) => {
    if (state.laneCount === laneCount) return state;
    return {
      laneCount,
      lanes: createDefaultLanes(laneCount),
    };
  }),

  toggleFlip: () => set((state) => ({ isFlipped: !state.isFlipped })),

  setIsFlipped: (isFlipped) => set({ isFlipped }),

  updateLaneCount: (laneNumber, delta) => set((state) => {
    const config = EVENT_CONFIGS[state.event];
    const lockoutMs = config.lockout * 1000;
    const agedTimestamp = Date.now() - lockoutMs - 1;

    return {
      lanes: state.lanes.map((lane) =>
        lane.laneNumber === laneNumber
          ? {
              ...lane,
              count: Math.max(0, Math.min(config.laps, lane.count + delta)),
              history: delta > 0
                ? [...lane.history, agedTimestamp]
                : lane.history.slice(0, -1).map((h, i, arr) =>
                    i === arr.length - 1 ? Math.min(h, agedTimestamp) : h
                  )
            }
          : lane
      ),
    };
  }),

  setLaneCountValue: (laneNumber, count) => set((state) => {
    const config = EVENT_CONFIGS[state.event];
    const lockoutMs = config.lockout * 1000;
    const agedTimestamp = Date.now() - lockoutMs - 1;

    return {
      lanes: state.lanes.map((lane) =>
        lane.laneNumber === laneNumber
          ? {
              ...lane,
              count: Math.max(0, Math.min(config.laps, count)),
              history: [...lane.history, agedTimestamp]
            }
          : lane
      ),
    };
  }),

  toggleLaneEmpty: (laneNumber) => set((state) => ({
    lanes: state.lanes.map((lane) =>
      lane.laneNumber === laneNumber
        ? { ...lane, isEmpty: !lane.isEmpty }
        : lane
    ),
  })),

  registerTouch: (laneNumber, ignoreLockout = false) => set((state) => {
    const config = EVENT_CONFIGS[state.event];
    const now = Date.now();

    return {
      lanes: state.lanes.map((lane) => {
        if (lane.laneNumber !== laneNumber || lane.isEmpty) return lane;

        const lastTouch = lane.history[lane.history.length - 1] || 0;
        if (!ignoreLockout && now - lastTouch < config.lockout * 1000) return lane;

        if (lane.count >= config.laps) return lane;

        return {
          ...lane,
          count: Math.min(config.laps, lane.count + 2),
          history: [...lane.history, now],
        };
      }),
    };
  }),

  resetRace: () => set((state) => ({
    lanes: createDefaultLanes(state.laneCount),
    isResetModalOpen: false,
  })),

  setResetModalOpen: (isResetModalOpen) => set({ isResetModalOpen }),
}));

// Expose store for tests if in browser
declare global {
  interface Window {
    __bellLapStore: typeof useBellLapStore;
  }
}

if (typeof window !== 'undefined') {
  window.__bellLapStore = useBellLapStore;
}
