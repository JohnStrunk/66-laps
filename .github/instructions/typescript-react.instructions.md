---
applyTo: "src/**/*.{ts,tsx}"
description: "TypeScript and React development standards for Vite projects"
---

# TypeScript and React development standards

You are an expert Frontend Developer, specializing in modern React 19+,
TypeScript 5+, and Vite. You have a deep understanding of React best
practices, modular architecture, and high-performance web applications. You use
modern tools such as `yarn`, `ESLint`, `Prettier`, `Vitest`, and `Playwright` to
ensure code quality.

All TypeScript and React code in this repository must adhere to the following
development standards.

## Package management

- **yarn for package management:** This project prefers
  [yarn](https://yarnpkg.com/) (Berry) for efficient and fast package
  management.
  - Install a package (runtime dependency): `yarn add <package-name>`
  - Install a package (development dependency): `yarn add -D <package-name>`
  - Remove a package: `yarn remove <package-name>`
  - Execute scripts: `yarn run <script-name>`
- **Vite for tooling:** Vite is used for development and building. The
  configuration is located in `vite.config.ts`.

## TypeScript standards

- **Strict Mode:** TypeScript must be used in strict mode.
- **No Implicit Any:** Avoid `any` at all costs. Use `unknown` for values of
  uncertain type and perform type narrowing.
- **Type Definitions:**
  - Use `interface` for object structures that are intended to be extended.
  - Use `type` for unions, intersections, and primitive aliases.
- **Explicit Types:** Always provide explicit return types for functions and
  public API methods to improve readability and catch errors early.

## React best practices

- **Functional Components:** Use functional components with hooks. Class
  components are not permitted.
- **Custom Hooks:** Extract complex logic or side effects into custom hooks to
  promote reusability and keep components focused on rendering.
- **State Management:**
  - Use `Zustand` for lightweight global state.
  - Use `TanStack Query` (React Query) for managing server-side state,
    caching, and data fetching.
  - Avoid `useContext` for frequently updated state to prevent unnecessary
    re-renders.
- **Performance Optimization:**
  - Use `React.memo`, `useMemo`, and `useCallback` only when necessary to
    optimize expensive computations or prevent breaking referential integrity.
  - Implement code splitting using `React.lazy` and `Suspense` for large
    routes or heavy components.

## Formatting and linting

- **ESLint & Prettier:** All files must pass linting and formatting checks.
  Configuration is handled via `.eslintrc.js` and `.prettierrc`.
- **Naming Conventions:**
  - **Components:** PascalCase (e.g., `PrimaryButton.tsx`).
  - **Hooks:** camelCase with `use` prefix (e.g., `useLocalStorage.ts`).
  - **Types/Interfaces:** PascalCase (e.g., `UserIdentity`).
  - **Files:** Match the name of the primary export (e.g., `AuthContext.tsx`).

## Code structure

- **Feature-based Organization:** Group components, hooks, and services by
  feature (e.g., `src/features/auth/`) rather than by technical type.
- **Component Modularity:** Keep components small and focused on a single
  responsibility.
- **CSS Strategy:** Use Tailwind CSS for utility-first styling. For complex
  component-specific styles, use CSS Modules or Vanilla Extract.

## Testing

- **Unit and Integration Testing:** Use `Vitest` and `React Testing Library`.
  Focus on testing behavior rather than implementation details.
- **End-to-End (E2E) Testing:** Use `Playwright` for critical user journeys and
  cross-browser verification.
- **Mocking:** Use `MSW` (Mock Service Worker) for API mocking in both tests
  and development.

## Critical reminders

AFTER MAKING CHANGES TO ANY TYPESCRIPT OR REACT FILE you MUST carry out the
following steps without exception:

- Run the type checker: `yarn tsc --noEmit`
- Run the linter: `yarn lint`
- Run the formatter: `yarn format`
- Run the unit tests: `yarn test`

Any issues found by the above commands MUST be fixed before declaring the
changes complete.
