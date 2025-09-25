# Use PostHog for analytics

## Context and problem statement

Application analytics are important to understand which site features are used
most, allowing development to focus on popular areas. Analytics also help
identify where users abandon the site, which can highlight usability issues
that need attention.

## Decision and justification

The decision is to use PostHog for application analytics.

PostHog was chosen because it offers a generous free tier and makes it easy to
integrate custom events and metrics. This flexibility allows for tracking
specific user interactions and generating meaningful reports, which supports
data-driven development and usability improvements.

## Other options considered

- Google Analytics: Also free, but primarily focused on commercial sites and
  purchase metrics. Integrating custom metrics and generating reports from
  them is difficult compared to PostHog.

## Additional information

PostHog: [https://posthog.com/](https://posthog.com/)
