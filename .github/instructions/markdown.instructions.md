---
applyTo: "**/*.md"
description: "Formatting and linting standards for Markdown files"
---

# Formatting and linting for Markdown files

All Markdown files in this repository must conform to the following formatting
and linting standards:

- All Markdown files must pass linting by markdownlint. After making **ANY**
  changes to a markdown file, run `pre-commit run --files <filename>` to
  ensure compliance. Fix **ALL** linting errors reported.
- Line length must not exceed 80 characters, with the exception of code blocks
  and tables.
- The proper style is defined by the markdownlint rules configured in
  [markdownlint-config.yaml](../markdownlint-config.yaml). Review this
  file prior to making changes to ensure compliance with the defined rules.

## Linting markdown files

- This repository uses
  [markdownlint-cli](https://github.com/igorshubovych/markdownlint-cli) for
  linting markdown files. If `markdownlint-cli` is not already installed, it
  can be installed using npm: `npm install -g markdownlint-cli`.
- To lint a markdown file, run the following command:

  ```bash
  markdownlint --config ../markdownlint-config.yaml <filename.md>
  ```

- Markdown linting is also enforced via pre-commit hooks. git commits will be
  blocked if any markdown files do not pass linting.
