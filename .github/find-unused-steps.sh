#!/bin/bash
# Find unused Cucumber steps in the 66-laps repository.
# Usage: ./.github/find-unused-steps.sh

NODE_OPTIONS="--import tsx" npx tsx .github/find-unused-steps.ts
