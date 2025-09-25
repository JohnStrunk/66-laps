# Styling via TailwindCSS

## Context and problem statement

TailwindCSS was chosen over writing custom CSS because it provides a robust set
of utility classes that allow for rapid styling without deep knowledge of CSS.
The goal was to simplify styling and avoid the need for extensive custom CSS or
complex pre/post-processing steps.

## Decision and justification

The decision is to use TailwindCSS for styling.

TailwindCSS enables fast development by offering a comprehensive set of utility
classes. Unlike some alternatives, it does not require additional pre- or
post-processing tools beyond its own setup. However, a trade-off is that class
names can become messy and duplicated in multiple places, which may be
revisited in the future if a better solution is found.

## Other options considered

- Custom CSS: Offers full control but requires more effort and deeper CSS
  knowledge. Can lead to more complex maintenance and the need for additional
  tooling.
- CSS-in-JS (e.g., styled-components): Provides scoped styles and dynamic
  theming, but adds runtime overhead and requires additional libraries.
- CSS Modules: Offers local scoping and modularity, but still requires writing
  and maintaining custom CSS files.

## Additional information
