#! /bin/bash

set -e -o pipefail

# Log output to a file for debugging purposes
exec > >(tee -a /tmp/install-packages.log) 2>&1


sudo corepack enable
corepack install -g yarn

npx -y playwright install --with-deps

npm install -g --no-fund \
    @google/gemini-cli \
    markdownlint-cli \
    @playwright/cli

curl -fsSL https://antigravity.google/cli/install.sh | bash
