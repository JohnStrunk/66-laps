import { execSync } from 'node:child_process';

/**
 * Script to find unused Cucumber steps in the 66-laps repository.
 * It uses the 'usage-json' formatter of cucumber-js in dry-run mode.
 */

interface StepUsage {
  matches: Array<unknown>;
  pattern: string;
  uri: string;
  line: number;
}

function findUnusedSteps() {
  console.log('Searching for unused Cucumber steps...');

  try {
    const cmd = 'NODE_OPTIONS="--import tsx" yarn cucumber-js --dry-run -f usage-json';
    const output = execSync(cmd, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    const usage: StepUsage[] = JSON.parse(output);

    const unusedSteps = usage.filter((step) => step.matches.length === 0);

    if (unusedSteps.length === 0) {
      console.log('No unused steps found! All steps are currently in use.');
      process.exit(0);
    }

    console.log(`
Found ${unusedSteps.length} unused step(s):
`);

    unusedSteps.forEach((step) => {
      console.log(`- ${step.pattern}`);
      console.log(`  File: ${step.uri}:${step.line}`);
      console.log('');
    });

    console.log('Recommendation: Review these steps and remove them if they are no longer needed.');
  } catch (error) {
    console.error('Error while running cucumber-js:', error);
    process.exit(1);
  }
}

findUnusedSteps();
