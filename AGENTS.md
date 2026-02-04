# AI Agent Guide for 66-laps

This document provides essential information for AI agents working on the
66-laps repository.

## Core Stack

- **Framework:** [Next.js](https://nextjs.org/) 16+ (React 19)
- **Language:** TypeScript 5+ (Strict Mode)
- **Package Manager:** [Yarn](https://yarnpkg.com/) 4 (Berry)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) 4
- **UI Components:** [HeroUI](https://heroui.com/) (formerly NextUI)
- **Graphics:** [PixiJS](https://pixijs.com/) (via `@pixi/react`)
- **Testing:** [Vitest](https://vitest.dev/) (Unit),
  [Playwright](https://playwright.dev/) (E2E/Browser)
- **Documentation:** [Storybook](https://storybook.js.org/)
- **Observability:** Sentry, PostHog

## Repository Structure

- `src/app/`: Next.js App Router pages and layouts.
  - **Main Site**: Core routes including `/` (home), `/counting`, `/practice`,
    and `/sheets`.
  - **PWA ("Bell Lap")**: Mobile-focused application code located under
    `src/app/(pwa)/app/`.
- `src/components/`: Feature-based component organization (e.g., `Pool/`,
  `Swimmer/`).
- `src/modules/`: Domain logic and models.
- `src/stories/`: Storybook stories.
- `.github/instructions/`: Detailed coding standards and workflows (CRITICAL).
- `.github/lint-all.sh`: script to run all linting and type checks.

## Project Terminology

- **Main Site**: Refers to the public-facing pages: `/`, `/counting`,
  `/practice`, and `/sheets`.
- **PWA / Bell Lap / "the app"**: Refers specifically to the Progressive Web
  App located at the `/app` route (source code in `src/app/(pwa)/app/`).

## Essential Commands

- **Development:** `yarn dev`
- **Build:** `yarn build`
- **Linting:** `yarn lint`
- **Testing:** `yarn test`
- **Type Check:** `yarn tsc --noEmit`
- **Storybook:** `yarn storybook`
- **All-in-one Lint:** `./.github/lint-all.sh`

## Development Standards

1. **React:** Use functional components and custom hooks. Class components are
   not permitted.
2. **TypeScript:** Strict mode is mandatory. Avoid `any`; use `unknown` and type
   narrowing. Always provide explicit return types.
3. **Styling:** Use Tailwind CSS utility classes.
4. **State Management:** Use Zustand for lightweight global state and TanStack
   Query for server-side state.
5. **Organization:** Group components, hooks, and services by feature in
   `src/components/`.
6. **Documentation:** Write Storybook stories for UI components.

## Commit Workflow

- **Sign-off:** All commits **MUST** include a sign-off
  (`git commit --signoff`) for DCO compliance.
- **Pre-commit:** This repository enforces pre-commit hooks. Ensure all checks
  pass.
- **Verification:** Before declaring a task complete, run:
  - `yarn tsc --noEmit`
  - `yarn lint`
  - `yarn test`
  - `./.github/lint-all.sh`

## Critical Instructions

Refer to these files for detailed guidance on specific topics:

- `.github/instructions/typescript-react.instructions.md`: TS/React standards.
- `.github/instructions/commit.instructions.md`: Git/Commit standards.
- `.github/instructions/markdown.instructions.md`: Markdown standards.
