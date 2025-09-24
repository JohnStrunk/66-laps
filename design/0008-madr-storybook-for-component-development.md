# Storybook for component development

## Context and problem statement

It is convenient to build, test, and style components in isolation outside the
main web app. This speeds up the development cycle since there is no need to
manipulate the main application to test different aspects of a React component.

## Decision and justification

The decision is to use Storybook for component development.

Storybook was chosen because it allows for rapid, isolated development and
testing of UI components. This improves developer productivity and makes it
easier to document and visually test components. The ability to preview
components in different states without running the full application is a
significant advantage.

## Other options considered

- None: No other tools were seriously considered. The choice was between using
  Storybook or not having an isolated component development tool.

## Additional information

{This section is optional. It can be used to provide additional information
that is relevant to the decision, such as links to related documents, diagrams,
or other resources. If there is no additional information, this section should
be omitted.}
