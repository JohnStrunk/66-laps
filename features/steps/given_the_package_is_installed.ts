import { Given } from '@cucumber/cucumber';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

Given('the {string} package is installed', function (packageName: string) {
  const pkgPath = join(process.cwd(), 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  const isInstalled = pkg.dependencies?.[packageName] || pkg.devDependencies?.[packageName];
  assert.ok(isInstalled, `${packageName} is not installed in package.json`);
});
