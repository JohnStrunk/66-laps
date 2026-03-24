import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';
import { SwimmerModel } from '../../src/modules/SwimmerModel';

export class CustomWorld extends World {
  browser?: Browser;
  context?: BrowserContext;
  page?: Page;

  // Swimmer Model state
  swimmer?: SwimmerModel;
  startTime?: number;
  currentTime?: number;

  // Verification state
  cucumberVersion?: string;
  verificationSuccess?: boolean;
  verificationError?: unknown;

  [key: string]: unknown;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);
