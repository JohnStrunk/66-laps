# Use vitest for testing

## Context and problem statement

The main options considered for testing frameworks were Jest and Vitest. Prior
experience with Vitest on a Vite-based project influenced the decision.
Integration with Storybook and React component development was also a factor.

## Decision and justification

The decision is to use Vitest for testing.

Vitest was chosen due to prior experience, its fast performance, and its
integration with Vite and Storybook. This makes it a natural fit for a modern
React project, especially when using Vite as a build tool. The ability to share
configuration and tooling with Storybook streamlines the development and
testing process.

## Other options considered

- Jest: The most popular JavaScript testing framework, with a large ecosystem
  and extensive documentation. However, it is not as tightly integrated with
  Vite or Storybook, and can be slower for large projects compared to Vitest.

## Additional information

{This section is optional. It can be used to provide additional information
that is relevant to the decision, such as links to related documents, diagrams,
or other resources. If there is no additional information, this section should
be omitted.}
