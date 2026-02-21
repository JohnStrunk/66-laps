import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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

export interface LapEvent {
  timestamp: number;
  type: 'touch' | 'manual_increment' | 'manual_decrement';
  prevCount: number;
  newCount: number;
}

export interface LaneState {
  laneNumber: number;
  count: number;
  isEmpty: boolean;
  history: number[]; // timestamps of touches for lockout
  events: LapEvent[]; // detailed history of changes
}

export interface RaceRecord {
  id: string;
  startTime: number;
  event: EventType;
  laneCount: number;
  eventNumber: string;
  heatNumber: string;
  lanes: LaneState[];
}

export type ViewState = 'main-menu' | 'race' | 'history';

export interface BellLapState {
  view: ViewState;
  history: RaceRecord[];
  event: EventType;
  laneCount: number;
  eventNumber: string;
  heatNumber: string;
  isFlipped: boolean;
  lanes: LaneState[];
  isSetupDialogOpen: boolean;

  // Actions
  setView: (view: ViewState) => void;
  setEvent: (event: EventType) => void;
  setLaneCount: (count: number) => void;
  setEventNumber: (num: string) => void;
  setHeatNumber: (num: string) => void;
  toggleFlip: () => void;
  setIsFlipped: (isFlipped: boolean) => void;
  updateLaneCount: (laneNumber: number, delta: number) => void;
  setLaneCountValue: (laneNumber: number, count: number) => void;
  toggleLaneEmpty: (laneNumber: number) => void;
  registerTouch: (laneNumber: number, ignoreLockout?: boolean) => void;
  resetRace: () => void;
  startRace: (event: EventType, laneCount: number, eventNumber: string, heatNumber: string) => void;
  setSetupDialogOpen: (open: boolean) => void;
  exitRace: () => void;
  clearHistory: () => void;
}

const createDefaultLanes = (count: number): LaneState[] =>
  Array.from({ length: count }, (_, i) => ({
    laneNumber: i + 1,
    count: 0,
    isEmpty: false,
    history: [],
    events: [],
  }));

export const useBellLapStore = create<BellLapState>()(
  persist(
    (set) => ({
      view: 'main-menu',
      history: [],
      event: '500 SC',
      laneCount: 8,
      eventNumber: '',
      heatNumber: '',
      isFlipped: false,
      lanes: createDefaultLanes(8),
      isSetupDialogOpen: false,

      setView: (view) => set({ view }),

      setEvent: (event) => set({ event }),

      setLaneCount: (laneCount) => set((state) => {
        if (state.laneCount === laneCount) return state;

        let newLanes = [...state.lanes];
        if (laneCount > state.lanes.length) {
          // Add more lanes
          const additional = Array.from({ length: laneCount - state.lanes.length }, (_, i) => ({
            laneNumber: state.lanes.length + i + 1,
            count: 0,
            isEmpty: false,
            history: [],
            events: [],
          }));
          newLanes = [...state.lanes, ...additional];
        }
        return {
          laneCount,
          lanes: newLanes,
        };
      }),

      setEventNumber: (eventNumber) => set({ eventNumber }),
      setHeatNumber: (heatNumber) => set({ heatNumber }),

      toggleFlip: () => set((state) => ({ isFlipped: !state.isFlipped })),

      setIsFlipped: (isFlipped) => set({ isFlipped }),

      updateLaneCount: (laneNumber, delta) => set((state) => {
        const config = EVENT_CONFIGS[state.event];
        const lockoutMs = config.lockout * 1000;
        const now = Date.now();
        const agedTimestamp = now - lockoutMs - 1;

        return {
          lanes: state.lanes.map((lane) => {
            if (lane.laneNumber !== laneNumber) return lane;
            const newCount = Math.max(0, Math.min(config.laps, lane.count + delta));
            if (newCount === lane.count) return lane;

            const event: LapEvent = {
              timestamp: now,
              type: delta > 0 ? 'manual_increment' : 'manual_decrement',
              prevCount: lane.count,
              newCount: newCount,
            };

            return {
              ...lane,
              count: newCount,
              history: delta > 0
                ? [...lane.history, agedTimestamp]
                : lane.history.slice(0, -1).map((h, i, arr) =>
                    i === arr.length - 1 ? Math.min(h, agedTimestamp) : h
                  ),
              events: [...lane.events, event],
            };
          }),
        };
      }),

      setLaneCountValue: (laneNumber, count) => set((state) => ({
        lanes: state.lanes.map((lane) =>
          lane.laneNumber === laneNumber
            ? { ...lane, count: Math.max(0, count) }
            : lane
        ),
      })),

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

            const newCount = Math.min(config.laps, lane.count + 2);
            const event: LapEvent = {
              timestamp: now,
              type: 'touch',
              prevCount: lane.count,
              newCount: newCount,
            };

            return {
              ...lane,
              count: newCount,
              history: [...lane.history, now],
              events: [...lane.events, event],
            };
          }),
        };
      }),

      resetRace: () => set((state) => ({
        lanes: createDefaultLanes(state.laneCount),
        isSetupDialogOpen: false,
        view: 'main-menu',
      })),

      startRace: (event, laneCount, eventNumber, heatNumber) => set(() => ({
        event,
        laneCount,
        eventNumber,
        heatNumber,
        lanes: createDefaultLanes(laneCount),
        isSetupDialogOpen: false,
        view: 'race',
      })),

      exitRace: () => set((state) => {
        if (state.view !== 'race') {
            return { view: 'main-menu' };
        }

        // Check if race has any data worth saving (any lane with count > 0)
        const hasData = state.lanes.some(l => l.count > 0);

        let newHistory = state.history;
        if (hasData) {
            // Find the earliest timestamp from all lanes events to use as start time
            let startTime = Date.now();
            let foundEvent = false;
            state.lanes.forEach(lane => {
                if (lane.events.length > 0) {
                    const firstEvent = lane.events[0].timestamp;
                    if (firstEvent < startTime) {
                        startTime = firstEvent;
                        foundEvent = true;
                    }
                }
            });

            const record: RaceRecord = {
                id: crypto.randomUUID(),
                startTime: foundEvent ? startTime : Date.now(),
                event: state.event,
                laneCount: state.laneCount,
                eventNumber: state.eventNumber,
                heatNumber: state.heatNumber,
                lanes: state.lanes,
            };

            newHistory = [record, ...state.history].slice(0, 50); // Keep only recent 50
        }

        return {
            view: 'main-menu',
            history: newHistory,
            // Clear current race state so next start is clean
            lanes: createDefaultLanes(state.laneCount),
            eventNumber: '',
            heatNumber: '',
        };
      }),

      clearHistory: () => set({ history: [] }),

      setSetupDialogOpen: (isSetupDialogOpen) => set({ isSetupDialogOpen }),
    }),
    {
      name: 'bell-lap-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        event: state.event,
        laneCount: state.laneCount,
        eventNumber: state.eventNumber,
        heatNumber: state.heatNumber,
        isFlipped: state.isFlipped,
        lanes: state.lanes,
        history: state.history,
        view: state.view,
      }),
    }
  )
);

// Expose store for tests if in browser
declare global {
  interface Window {
    __bellLapStore: typeof useBellLapStore;
  }
}

if (typeof window !== 'undefined') {
  window.__bellLapStore = useBellLapStore;
}
