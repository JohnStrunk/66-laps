# HeroUI for UI components

## Context and problem statement

To build the user interface for the website, a set of React components was
needed. Given the prior decisions to use
[Next.js](0002-madr-next.js-as-project-meta-framework.md),
[React](0001-madr-react-for-web-development.md), and
[TailwindCSS](0009-madr-styling-via-tailwindcss.md), it was important to
select a component library that is fully compatible with these technologies.
The chosen library should provide a robust set of components, integrate well
with Tailwind for styling, and allow for customization to fit the project's
needs.

## Decision and justification

HeroUI was selected as the UI component library for the project.

HeroUI offers an extensive set of pre-built React components, all styled using
TailwindCSS. This ensures seamless integration with the project's existing
styling approach and technology stack, as established in the decisions for
[React](0001-madr-react-for-web-development.md) and
[TailwindCSS](0009-madr-styling-via-tailwindcss.md). The components are easily
customizable, allowing for rapid development and later refinement of the
site's look and feel. By choosing HeroUI, the team can quickly assemble a
functional and visually appealing interface, with the flexibility to adjust
styles as requirements evolve.

## Other options considered

- headlessui: Provides unstyled, accessible React components, but would require
  building all styling from scratch. This would slow down initial development
  and increase the effort needed to achieve a polished UI.

## Additional information

- HeroUI: [https://www.heroui.com/](https://www.heroui.com/)
