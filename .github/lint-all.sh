#! /bin/bash

set -e -o pipefail

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)
TOP_DIR=$(cd "$SCRIPT_DIR/.." && pwd)

# This command ensures pre-commit is run on all modified files, not just those
# currently tracked by git. That allows linting of new files in addition to
# modified ones. It properly obeys .gitignore
find "$TOP_DIR" -type f -not -path '*/.git/*' | while read -r file; do
	if ! git check-ignore -q "$file"; then
		echo "$file"
	fi
done | xargs pre-commit run --files
