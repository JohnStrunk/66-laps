import { Given } from '@cucumber/cucumber';
import { CustomWorld } from '../support/world';

Given('Lane {int} is on Lap {int} but touched earlier than Lane {int}', async function (this: CustomWorld, l1: number, lap: number, l2: number) {
  await this.page!.evaluate((args) => {
    const store = (window as any).__bellLapStore.getState();
    const lanes = store.lanes.map((l: any) => {
      if (l.laneNumber === args.l1) return { ...l, count: args.lap, history: [Date.now() - 1000] };
      if (l.laneNumber === args.l2) return { ...l, count: args.lap, history: [Date.now()] };
      return l;
    });
    (window as any).__bellLapStore.setState({ lanes });
  }, { l1, l2, lap });
});
