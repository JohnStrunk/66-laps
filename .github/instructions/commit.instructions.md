---
applyTo: "**"
---

# Committing Changes to Git

- **Sign-off required:** This repository requires adding a "sign-off" on all
  commits to indicate compliance with the DCO. When committing changes, you
  must use the git `--signoff` option to add a "Signed-off-by" line to your
  commit message.
- **Pre-commit checks:** This repository uses the `pre-commit` tool to enforce
  code quality and consistency checks before each commit. It is essential to
  ensure that all pre-commit hooks pass successfully before finalizing any
  commit.
- **All-in-one linting:** Always run [lint-all.sh](../lint-all.sh) prior to
  committing to catch any issues early. You must fix any issues identified by
  this linting process. You will not be able to commit until all issues are
  resolved.
- **Commit messages:** When committing changes, ensure that your commit
  messages cover all changes being committed, not just changes to fix
  pre-commit or linting issues.
- **Message format:** This repository does not use "conventional commits"
  format for commit messages. Write a clear, concise title in the imperative
  mood, followed by a more detailed description in the body if necessary.
