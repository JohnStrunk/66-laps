# Next.js as the project meta-framework

## Context and problem statement

The project is currently a static site, so server-side features are not
required.

Initially, plain React with Vite was considered. However, the convenience of
built-in routing and other integrated features offered by a meta-framework
became apparent.

## Decision and justification

The decision is to use Next.js as the project's meta-framework.

Next.js was chosen because it is well supported, very popular, and provides a
robust set of integrated features such as routing, static site generation, and
extensibility.

While Astro was considered for its lightweight approach, Next.js's popularity
and proven track record made it the preferred choice for long-term
maintainability and community support.

## Other options considered

- Vite with plain React: Considered for its simplicity and speed, but lacked
  integrated routing and meta-framework features.
- Astro: Considered for its lightweight nature and static site focus, but
  Next.js was chosen for its popularity and maturity.

## Additional information

- [Next.js](https://nextjs.org/)
- [Vite](https://vitejs.dev/)
- [Astro](https://astro.build/)
