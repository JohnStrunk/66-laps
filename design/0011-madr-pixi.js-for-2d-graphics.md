# Pixi.js for 2D graphics

## Context and problem statement

The project requires efficient and high-performance 2D graphics rendering for
web applications. The chosen solution should be fast, widely supported, and
integrate well with the existing React-based architecture.

## Decision and justification

Pixi.js was selected as the 2D graphics rendering engine for the project.

Pixi.js is a fast and efficient 2D WebGL renderer that is popular and easy to
use. It provides robust performance for complex 2D scenes and is
well-maintained by the community. Importantly, Pixi.js offers integration with
React via [`@pixi/react`](https://github.com/pixijs/pixi-react), which wraps
Pixi objects and fits within React's rendering and update model. This allows
seamless use of 2D graphics within the React component tree, aligning with the
project's architectural decisions for UI development.

## Other options considered

- Canvas API: Native HTML5 Canvas is flexible but requires more manual work
  for scene management and lacks React integration.
- Three.js: Powerful for 3D and some 2D, but overkill for pure 2D needs and
  more complex to integrate with React.

## Additional information

- Pixi.js: [https://pixijs.com/](https://pixijs.com/)
- @pixi/react:
  [https://github.com/pixijs/pixi-react](https://github.com/pixijs/pixi-react)
