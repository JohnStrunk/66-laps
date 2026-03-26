import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const RESULTS_FILE = join(process.cwd(), 'test-results', 'results.json');

interface StepResult {
  status: string;
  duration: number; // nanoseconds
}

interface Step {
  keyword: string;
  name: string;
  match?: {
    location: string;
  };
  result: StepResult;
}

interface Element {
  name: string;
  steps: Step[];
  type: string;
}

interface Feature {
  name: string;
  uri: string;
  elements: Element[];
}

function formatDuration(ns: number): string {
  if (ns < 1000) return `${ns}ns`;
  if (ns < 1000000) return `${(ns / 1000).toFixed(2)}µs`;
  if (ns < 1000000000) return `${(ns / 1000000).toFixed(2)}ms`;
  return `${(ns / 1000000000).toFixed(2)}s`;
}

async function summarize() {
  if (!existsSync(RESULTS_FILE)) {
    console.error(`No test results found at ${RESULTS_FILE}`);
    return;
  }

  const content = readFileSync(RESULTS_FILE, 'utf8');
  if (!content) {
    console.error('Test results file is empty');
    return;
  }

  const features: Feature[] = JSON.parse(content);

  const stepStats = new Map<string, { totalDuration: number; count: number; name: string }>();
  const individualSteps: { duration: number; name: string; scenario: string; location: string }[] = [];

  for (const feature of features) {
    for (const element of feature.elements) {
      if (element.type !== 'scenario') continue;

      for (const step of element.steps) {
        if (!step.result || step.result.status === 'skipped') continue;

        const duration = step.result.duration || 0;
        const location = step.match?.location || 'unknown';
        const name = step.name || step.keyword.trim();

        // Stats by location (step definition)
        const stats = stepStats.get(location) || { totalDuration: 0, count: 0, name: name };
        stats.totalDuration += duration;
        stats.count += 1;
        stepStats.set(location, stats);

        // Individual slow steps
        individualSteps.push({
          duration,
          name,
          scenario: element.name,
          location
        });
      }
    }
  }

  console.log('\n' + '='.repeat(80));
  console.log('TEST PROFILING SUMMARY');
  console.log('='.repeat(80));

  console.log('\nTop 10 Slowest Step Definitions (Cumulative Time):');
  const sortedStats = Array.from(stepStats.entries())
    .sort((a, b) => b[1].totalDuration - a[1].totalDuration)
    .slice(0, 10);

  console.log('-'.repeat(80));
  console.log(`${'Duration'.padEnd(12)} | ${'Avg'.padEnd(10)} | ${'Count'.padEnd(6)} | ${'Location'}`);
  console.log('-'.repeat(80));

  for (const [location, stats] of sortedStats) {
    const avg = stats.totalDuration / stats.count;
    console.log(
      `${formatDuration(stats.totalDuration).padEnd(12)} | ` +
      `${formatDuration(avg).padEnd(10)} | ` +
      `${stats.count.toString().padEnd(6)} | ` +
      `${location}`
    );
    console.log(`  Step: ${stats.name}`);
  }

  console.log('\nTop 10 Slowest Individual Step Instances:');
  const sortedIndividual = individualSteps
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10);

  console.log('-'.repeat(80));
  console.log(`${'Duration'.padEnd(12)} | ${'Scenario'.padEnd(30)} | ${'Step'}`);
  console.log('-'.repeat(80));

  for (const step of sortedIndividual) {
    console.log(
      `${formatDuration(step.duration).padEnd(12)} | ` +
      `${step.scenario.substring(0, 28).padEnd(30)} | ` +
      `${step.name}`
    );
  }
  console.log('='.repeat(80) + '\n');
}

summarize().catch(console.error);
