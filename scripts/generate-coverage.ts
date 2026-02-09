import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import MCR from 'monocart-coverage-reports';

const COVERAGE_DIR = join(process.cwd(), 'test-results', 'coverage');
const REPORT_DIR = join(process.cwd(), 'test-results', 'report');

async function generateReport() {
  if (!existsSync(COVERAGE_DIR)) {
    console.error('No coverage data found in', COVERAGE_DIR);
    return;
  }

  const files = readdirSync(COVERAGE_DIR).filter(f => f.endsWith('.json'));
  if (files.length === 0) {
    console.error('No .json coverage files found in', COVERAGE_DIR);
    return;
  }

  console.log(`Processing ${files.length} coverage files...`);

  const coverageOptions: MCR.CoverageReportOptions = {
    name: '66 Laps Coverage Report',
    outputDir: REPORT_DIR,
    reports: [
      ['console-summary'],
      ['html', {
        subdir: 'html'
      }],
      ['lcovonly', {
        file: 'lcov.info'
      }]
    ],
    entryFilter: (entry: MCR.V8CoverageEntry) => {
      // Focus on application code
      return entry.url.includes('localhost:3000') &&
             !entry.url.includes('node_modules') &&
             !entry.url.includes('hmr-client');
    },
    // Attempt to resolve source maps from local filesystem if they are not in the URL
    // sourceMap: {
        // Next.js with Turbopack stores maps in .next/build/chunks or similar
        // This is a complex mapping, but MCR can sometimes handle it if we point it to the root
    // }
  };

  const mcr = MCR(coverageOptions);

  for (const file of files) {
    const filePath = join(COVERAGE_DIR, file);
    try {
      const content = JSON.parse(readFileSync(filePath, 'utf8'));
      if (Array.isArray(content) && content.length > 0) {
        await mcr.add(content);
      }
    } catch (e) {
      console.warn(`Failed to process ${file}:`, e);
    }
  }

  await mcr.generate();
  console.log(`Report generated in ${REPORT_DIR}`);
}

generateReport().catch(console.error);
