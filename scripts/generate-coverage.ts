import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
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
    sourceMap: true,

    // Help MCR find source maps and original files on disk
    // turbopack-specific mappings can be tricky, but pointing to root often helps
    // as many maps contain relative paths to the source.
    baseDir: process.cwd(),

    filter: {
      '**/node_modules/**': false,
      '**/hmr-client/**': false,
      '**/.next/**': false,
      '**/src/**': true,
      '**/*': false
    },

    entryFilter: (entry: MCR.V8CoverageEntry) => {
      return entry.url.includes('localhost:3000') &&
             !entry.url.includes('node_modules') &&
             !entry.url.includes('hmr-client');
    },

    sourcePath: (filePath: string) => {
      // Cleaner paths in the report
      if (filePath.startsWith('file://')) {
        const path = filePath.replace('file://', '');
        if (path.startsWith(process.cwd())) {
          return relative(process.cwd(), path);
        }
        return path;
      }
      if (filePath.startsWith(process.cwd())) {
        return relative(process.cwd(), filePath);
      }
      return filePath;
    },

    reports: [
      ['console-summary'],
      ['console-details'],
      ['html', {
        subdir: 'html'
      }],
      ['lcovonly', {
        file: 'lcov.info'
      }]
    ],

    // Include all files from src even if they were not touched by tests
    all: {
      dir: ['src'],
      filter: {
        '**/*.d.ts': false,
        '**/*.stories.tsx': false,
        '**/*.stories.ts': false,
        '**/*.test.ts': false,
        '**/*.tsx': true,
        '**/*.ts': true
      }
    }
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
