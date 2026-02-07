import { useBellLapStore } from '../../src/modules/bellLapStore';

export type TestWindow = Window & typeof globalThis & {
  __bellLapStore: typeof useBellLapStore;
};
