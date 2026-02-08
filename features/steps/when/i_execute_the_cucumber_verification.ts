import { When } from '@cucumber/cucumber';
import { execSync } from 'node:child_process';
import { join } from 'node:path';
import { CustomWorld } from '../../support/world';

When('I execute the cucumber verification', function (this: CustomWorld) {
  try {
    const binPath = join(process.cwd(), 'node_modules', '.bin', 'cucumber-js');
    const version = execSync(`${binPath} --version`, { encoding: 'utf8' }).trim();
    this.cucumberVersion = version;
    this.verificationSuccess = true;
  } catch (error) {
    this.verificationSuccess = false;
    this.verificationError = error;
  }
});
