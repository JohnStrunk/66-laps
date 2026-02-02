#!/usr/bin/env bash
# update-instructions.sh
# Update AI instruction files from upstream template with three-way merge
# Usage: .github/update-instructions.sh [--dry-run]

set -euo pipefail

# Determine repo root (directory containing this script is .github/)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

UPSTREAM_REPO="https://github.com/JohnStrunk/template.git"
UPSTREAM_BRANCH="main"
DRY_RUN=false

if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=true
  echo "[DRY RUN] No files will be modified."
fi

# Directories and files to update (relative to repo root)
TARGETS=(
  ".claude/skills"
  ".github/instructions"
  "AGENTS.md"
)

# Create a temp directory for upstream
TMPDIR=$(mktemp -d)
trap 'rm -rf "$TMPDIR"' EXIT

echo "Cloning upstream template..."
git clone --depth=1 --branch "$UPSTREAM_BRANCH" "$UPSTREAM_REPO" "$TMPDIR/upstream"

for TARGET in "${TARGETS[@]}"; do
  LOCAL_PATH="$REPO_ROOT/$TARGET"
  UPSTREAM_PATH="$TMPDIR/upstream/$TARGET"
  if [[ -e "$LOCAL_PATH" ]]; then
    if [[ -d "$LOCAL_PATH" ]]; then
      find "$LOCAL_PATH" -type f | while read -r FILE; do
        REL_PATH="${FILE#"$REPO_ROOT"/}"
        UPSTREAM_FILE="$TMPDIR/upstream/$REL_PATH"
        if [[ -f "$UPSTREAM_FILE" ]]; then
          if $DRY_RUN; then
            echo "[DRY RUN] diff $REL_PATH with upstream..."
            diff -u "$FILE" "$UPSTREAM_FILE" || true
          else
            BASE_FILE="$FILE.base"
            cp "$FILE" "$BASE_FILE"
            echo "Merging $REL_PATH with upstream..."
            diff3 -m "$FILE" "$BASE_FILE" "$UPSTREAM_FILE" > "$FILE.merged" || true
            if grep -q '<<<<<<<' "$FILE.merged"; then
              echo "CONFLICT in $REL_PATH. See $FILE.merged for manual resolution."
            else
              mv "$FILE.merged" "$FILE"
              echo "Updated $REL_PATH."
            fi
            rm -f "$BASE_FILE"
          fi
        fi
      done
    elif [[ -f "$LOCAL_PATH" ]]; then
      if [[ -f "$UPSTREAM_PATH" ]]; then
        if $DRY_RUN; then
          echo "[DRY RUN] diff $TARGET with upstream..."
          diff -u "$LOCAL_PATH" "$UPSTREAM_PATH" || true
        else
          BASE_FILE="$LOCAL_PATH.base"
          cp "$LOCAL_PATH" "$BASE_FILE"
          echo "Merging $TARGET with upstream..."
          diff3 -m "$LOCAL_PATH" "$BASE_FILE" "$UPSTREAM_PATH" > "$LOCAL_PATH.merged" || true
          if grep -q '<<<<<<<' "$LOCAL_PATH.merged"; then
            echo "CONFLICT in $TARGET. See $LOCAL_PATH.merged for manual resolution."
          else
            mv "$LOCAL_PATH.merged" "$LOCAL_PATH"
            echo "Updated $TARGET."
          fi
          rm -f "$BASE_FILE"
        fi
      fi
    fi
  fi
done

echo "Update complete."
if $DRY_RUN; then
  echo "[DRY RUN] No files were modified."
fi
