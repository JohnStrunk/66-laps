# Package management via yarn

## Context and problem statement

The default npm package manager is widely used but can be slow for large
projects. A faster, more efficient package manager was desired. Previous
experience with yarn influenced the decision, but other modern alternatives
were also considered.

## Decision and justification

The decision is to use yarn for package management.

Yarn was chosen for its improved speed over npm, better dependency resolution,
and familiarity. The project uses Yarn 3+ (Berry), which brings new features
and performance improvements, but requires Corepack to manage the correct yarn
version across environments. Yarn's plug'n'play (PnP) and workspaces features
are also beneficial for future scalability.

## Other options considered

- npm: The default Node.js package manager. Universally supported and simple,
  but historically slower and less feature-rich than yarn or pnpm. Recent
  versions have improved performance and added workspaces, but yarn was still
  preferred for speed and familiarity.
- pnpm: A modern alternative known for its speed and disk efficiency, using a
  content-addressable store for node_modules. pnpm is often faster than both
  npm and yarn, and saves disk space by hard-linking packages. However, it is
  less familiar to the team and can have compatibility issues with some
  tooling.
- Yarn v1: The original version of yarn, widely adopted for its speed and
  reliability over npm at the time. However, Yarn v1 is now considered legacy,
  and the project uses Yarn 3+ (Berry) for its modern features and
  improvements.

## Additional information

{This section is optional. It can be used to provide additional information
that is relevant to the decision, such as links to related documents, diagrams,
or other resources. If there is no additional information, this section should
be omitted.}
