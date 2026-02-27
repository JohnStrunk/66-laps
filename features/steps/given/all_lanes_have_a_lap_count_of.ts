import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../../support/world';
import { TestWindow } from '../../support/store-type';
import { EVENT_CONFIGS } from '../../../src/modules/bellLapStore';

Given('all lanes have a lap count of {int}', async function (this: CustomWorld, count: number) {
  if (!this.page) throw new Error('No page found');
  await this.page.evaluate(({ targetCount, configs }) => {
    const store = (window as unknown as TestWindow).__bellLapStore;
    const state = store.getState();
    const newLanes = state.lanes.map(lane => {
      const diff = targetCount - lane.count;
      if (diff === 0) return lane;

      const config = configs[state.event as keyof typeof configs] || { laps: 66, lockout: 15 };
      const newCount = Math.max(0, Math.min(config.laps, targetCount));
      const now = state.now;
      const lockoutMs = config.lockout * 1000;
      const agedTimestamp = now - lockoutMs - 1;

      return {
        ...lane,
        count: newCount,
        history: diff > 0
          ? [...lane.history, agedTimestamp]
          : lane.history.slice(0, -1).map((h, i, arr) =>
              i === arr.length - 1 ? Math.min(h, agedTimestamp) : h
            ),
        events: [...lane.events, {
          timestamp: now,
          type: diff > 0 ? ('manual_increment' as const) : ('manual_decrement' as const),
          prevCount: lane.count,
          newCount: newCount,
        }],
      };
    });
    store.setState({ lanes: newLanes });
  }, { targetCount: count, configs: EVENT_CONFIGS });
});
