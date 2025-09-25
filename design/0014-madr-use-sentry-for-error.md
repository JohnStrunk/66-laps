# Use Sentry for error tracking

## Context and problem statement

Automated error tracking is essential for maintaining high quality in
production. Users rarely report problems; instead, they may ignore issues or
abandon the site. An error tracking solution should provide actionable
information to resolve errors quickly.

## Decision and justification

The decision is to use Sentry for error tracking in this project.

Sentry offers a free tier and has proven effective in other projects. It
provides detailed stack traces for errors, enabling quick identification and
resolution of programming issues. By automatically monitoring and logging
errors, Sentry helps maintain a high-quality user experience and ensures that
problems are addressed even if users do not report them.

## Other options considered

- Manual error reporting: Relies on users to report issues, which is
  unreliable and often results in unresolved problems.
- Other error tracking services: May not offer a free tier or as robust a
  feature set as Sentry.

## Additional information

Sentry: [https://sentry.io/](https://sentry.io/)
