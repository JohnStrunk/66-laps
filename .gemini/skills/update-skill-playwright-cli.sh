#!/bin/bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$SCRIPT_DIR/playwright-cli"
REPO_URL="https://github.com/microsoft/playwright-cli.git"
SKILL_PATH="skills/playwright-cli"
TEMP_DIR=$(mktemp -d)

cleanup() {
    rm -rf "$TEMP_DIR"
}
trap cleanup EXIT

echo "Updating playwright-cli skill from $REPO_URL..."
echo "Temporary directory: $TEMP_DIR"

# Clone the repository with sparse checkout
cd "$TEMP_DIR"
git clone --filter=blob:none --sparse "$REPO_URL" repo
cd repo
git sparse-checkout set "$SKILL_PATH"

# Remove old skill directory contents (but keep the directory)
echo "Removing old skill contents..."
rm -rf "${SKILLS_DIR:?}"/*

# Copy new contents
echo "Copying new skill contents..."
cp -r "$SKILL_PATH"/* "$SKILLS_DIR/"

echo "Successfully updated playwright-cli skill!"
echo "Updated files:"
find "$SKILLS_DIR" -type f | sort
