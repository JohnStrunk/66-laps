import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'node:assert';
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

Given('the {string} package is installed', function (packageName: string) {
  const pkgPath = join(process.cwd(), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const isInstalled = pkg.dependencies?.[packageName] || pkg.devDependencies?.[packageName];
  assert.ok(isInstalled, `${packageName} is not installed in package.json`);
});

When('I execute the cucumber verification', function () {
  try {
    // Attempt to run the locally installed cucumber-js directly from .bin
    // This verifies that the binary is correctly linked and executable
    const binPath = join(process.cwd(), 'node_modules', '.bin', 'cucumber-js');
    const version = execSync(`${binPath} --version`, { encoding: 'utf8' }).trim();
    this.cucumberVersion = version;
    this.verificationSuccess = true;
  } catch (error) {
    this.verificationSuccess = false;
    this.verificationError = error;
  }
});

Then('cucumber should report its version', function () {
  assert.ok(this.cucumberVersion, 'Cucumber version should be reported');
});

Then('the verification should be successful', function () {
  assert.strictEqual(this.verificationSuccess, true, `Verification failed: ${this.verificationError}`);
});
