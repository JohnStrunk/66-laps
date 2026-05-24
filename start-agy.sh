#! /bin/bash

set -e -o pipefail

# Disable commit signing for AI generated commits
export GIT_CONFIG_KEY_0=commit.gpgsign
export GIT_CONFIG_VALUE_0=false
export GIT_CONFIG_KEY_1=tag.gpgsign
export GIT_CONFIG_VALUE_1=false
export GIT_CONFIG_COUNT=2

exec agy --dangerously-skip-permissions "$@"
