# The website will be hosted on GitHub Pages

## Context and problem statement

An easy solution was needed for deploying the website. Only static page hosting
is required—no server-side rendering or databases. GitHub Pages meets these
requirements.

## Decision and justification

The decision is to host the website on GitHub Pages.

GitHub Pages was chosen because it integrates well with GitHub Actions,
supports custom domains, and is simple to set up for static sites.
Alternatives like Netlify or Vercel were considered, but GitHub Pages provided
all the needed features with minimal configuration.

## Other options considered

- Netlify: Good for static sites, but not needed since GitHub Pages already
  integrates with the existing workflow.
- Vercel: Also a strong option, but GitHub Pages was simpler for this use case
  and already supported custom domains.

## Additional information

{This section is optional. It can be used to provide additional information
that is relevant to the decision, such as links to related documents, diagrams,
or other resources. If there is no additional information, this section should
be omitted.}
