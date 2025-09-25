# Use GitHub Actions for CI/CD

## Context and problem statement

Code needs to be tested before deployment. Incorporating an automated CI system
removes the need to manually check whether existing tests pass for each change.
Automated enforcement of tests and linting rules (e.g., pre-commit) helps
prevent regressions and ensures code quality. CD ensures that production
deployments are consistent and repeatable.

## Decision and justification

The decision is to use GitHub Actions for CI/CD.

GitHub Actions was chosen for its cost and convenience. It is free for public
repositories and is well integrated into the GitHub development workflow.
Automated checks for tests and linting can be enforced with each code change,
and deployments can be managed in a consistent, repeatable way. Other systems
like Travis CI or CircleCI, while good, are not as well integrated with GitHub
and may incur costs.

## Other options considered

- Travis CI: Good feature set, but not as well integrated with GitHub and may
  incur costs.
- CircleCI: Similar to Travis, but less convenient for GitHub-based workflows
  and not free for public repos.

## Additional information

{This section is optional. It can be used to provide additional information
that is relevant to the decision, such as links to related documents, diagrams,
or other resources. If there is no additional information, this section should
be omitted.}
