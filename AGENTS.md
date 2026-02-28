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

## Important Constraints

- **Package Management:** This project strictly uses **Yarn**. Never use `npm`
  for installing packages or running scripts. Ensure `yarn.lock` is updated and
  not `package-lock.json`.

## Essential Commands

- **Development:** `yarn dev`
- **Build:** `yarn build`
- **Linting:** `yarn lint`
- **Testing:**
  - `yarn test`: Runs the full suite against the dev server with 2 parallel
    workers. Good for general regression checks during development.
  - `yarn test:unit`: Runs only non-browser logic tests (Extremely fast, <1s).
    Use this frequently during domain logic or model development.
  - `yarn test:static`: Builds the project and runs tests against the static
    export. This is the **most stable and fastest** way to run the full suite.
    Use this for final verification before committing or in CI.
  - `yarn test:e2e`: Runs only browser-dependent tests.
- **Subset Testing (for faster dev cycles):**
  - Ensure `yarn dev` is running in the background.
  - Run a single feature:
    `NODE_OPTIONS="--import tsx" npx cucumber-js features/file.feature`
  - Run by scenario name:
    `NODE_OPTIONS="--import tsx" npx cucumber-js --name "Scenario Name"`
  - Run by tags (if added to .feature):
    `NODE_OPTIONS="--import tsx" npx cucumber-js --tags "@yourtag"`
  - Run by line number:
    `NODE_OPTIONS="--import tsx" npx cucumber-js features/file.feature:10`
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
7. **Verification:** While subset testing is useful during development, a full
   `yarn test` run and `yarn lint` run is **MANDATORY** before declaring a
   task complete to ensure no regressions were introduced.

## Architectural Patterns

- **State Management (Zustand):**
  - The `bellLapStore` is the source of truth for race state.
  - **Store Slicing:** To maintain scalability, the store is divided into
    logical slices (e.g., `race`, `history`, `ui`).
  - It uses the `persist` middleware to save race data (lanes, counts, history)
    to `localStorage`.
  - UI-only state (like dialog visibility) is excluded from persistence.
  - **Hydration Safety:** When using the store in Next.js components, use
    `useSyncExternalStore` or ensure components only render store-dependent
    data after mounting to avoid SSR mismatches.
- **Logic & UI Separation:**
  - **Business Logic in Store:** Core logic (e.g., determining lockout status,
    lap symbols, or race completion) should reside in the Zustand store or
    specialized selectors, not within UI components.
  - **Representational Components:** Components like `LaneRow` should focus on
    rendering state and delegating actions to the store. Avoid local state
    synchronization; derive values during rendering.
- **Simulation Model (`SwimmerModel`):**
  - Encapsulates the logic for calculating a swimmer's position based on lap
    times and elapsed time.
  - Used primarily in the `/practice` feature.
- **Graphics (PixiJS):**
  - Integrated via `@pixi/react`.
  - **Performance Optimization:** Avoid using React state (e.g., `useState`)
    inside `useTick` for high-frequency updates (like position). Use `useRef`
    to manipulate Pixi objects directly to bypass React's render cycle for
    smoother performance.

## Coding Best Practices

- **Hydration Safety:** When checking for client-side mounting (e.g., to avoid
  SSR mismatches), use `useSyncExternalStore` instead of `useEffect` with
  `useState`. This is more idiomatic in React 18/19 and avoids unnecessary
  re-renders and lint warnings.
- **Avoid Syncing State in Effects:** Never use `useEffect` to synchronize local
  state with props or global store state. Perform such updates in event
  handlers (e.g., `onPress`) or derive values during rendering using `useMemo`.
  Strict linting (`react-hooks/set-state-in-effect`) is enforced.
- **Zustand Persistence:** When adding new state to the store, consider if it
  needs to be persisted. Use the `partialize` function in the `persist`
  middleware to selectively persist state.
- **Cucumber Step Parameters:** All parameters defined in Cucumber expressions
  (e.g., `{string}`) MUST be used in the step implementation. Use them for
  assertions or logging to ensure tests are rigorous and satisfy linting rules.
  Do not use `eslint-disable` to bypass unused variable warnings.

## Commit Workflow

- **No Push/PR:** NEVER push to the remote repository or open a Pull Request
  unless specifically instructed to do so by the user.
- **Linting:** You MUST run `yarn lint` after editing any code or tests and
  before committing to ensure code quality and fix any warnings or errors.
- **Sign-off:** All commits **MUST** include a sign-off
  (`git commit --signoff`) for DCO compliance.
- **Pre-commit:** This repository enforces pre-commit hooks. Ensure all checks
  pass.
- **Verification:** Before declaring a task complete, run:
  - `yarn tsc --noEmit`
  - `yarn lint`
  - `yarn test`
  - `./.github/lint-all.sh`

## Performance Optimization

- **Consolidate Timers:** Avoid creating individual `setInterval` or
  `setTimeout` timers in components that are rendered multiple times (e.g.,
  `LaneRow`). Instead, use a single global timer, a store-level tick, or
  `requestAnimationFrame` to manage time-based state updates like lockout
  progress.
- **Store Access:** When accessing specific items from a list in the store
  (e.g., a single lane in `LaneRow`), prefer passing the data as props from the
  parent or using a memoized selector to avoid re-running `find()` on every
  store update.

## Observability & Analytics

- **PostHog Integration:** All core user actions in the Bell Lap PWA must be
  tracked to understand user behavior. This includes:
  - Starting a race (event type, lane count).
  - Touch registration (manual vs automatic).
  - Manual overrides (increments/decrements).
  - Toggling lane empty state.
  - Completing and exiting a race.
- **Custom Events:** Use the helpers in `src/modules/phEvents.ts` to ensure
  consistent event naming and properties.

## Testing Standards

- **Mandatory Testing:** Any code modification MUST include tests that ensure
  the functionality works as expected.
- **Red/Green TDD:** ALWAYS use Red/Green TDD when writing code or fixing bugs.
  When addressing a bug or broken functionality, you MUST write the tests
  first, confirm that they fail (Red), then implement the fix, and finally
  confirm that the tests pass (Green).
- **Feature Coverage:** All features that are implemented or changed MUST be
  described in a feature file (`features/*.feature`) and have corresponding
  test scenarios that verify the functionality.
- **Meaningful Tests:** Never create tests that "pass" without actually
  verifying the intended functionality. Steps that are not yet implemented
  should use Cucumber's `return 'pending';` rather than a "noop" return. Once a
  feature is implemented, tests must accurately and rigorously verify the logic.
  "Fake" passing tests are strictly unacceptable.
- **Time-Based Logic:** For tests involving lockout or other time-based
  behaviors, use `this.page.clock.install()` in the `Before` hook and
  `this.page.clock.fastForward()` in step definitions to ensure fast and
  reliable execution.
- **Internal State Verification:** While primarily using UI-based assertions,
  you can use `window.__bellLapStore` to perform rigorous assertions on the
  underlying Zustand store state when the UI state is complex or hard to verify
  directly.
- **E2E Testing with Mock Clock:**
  - This project uses `this.page.clock.install()` in Playwright tests to
    efficiently test time-based logic (like lockout).
  - **CRITICAL:** When the mock clock is installed, time is frozen.
    Animations (HeroUI Modals, Dropdowns, and initial hydration) will NOT
    progress unless the clock is explicitly advanced.
  - **Synchronization Helpers:** ALWAYS use the following helpers from
    `features/support/utils.ts` for reliable UI testing:
    - `advanceClock(page, ms)`: Manually advances the mock clock.
    - `waitForVisible(locator)`: Robustly waits for an element while
      continuously advancing the clock in 100ms increments (necessary for
      opening animations).
    - `waitForHidden(locator)`: Robustly waits for an element to disappear
      while advancing the clock (necessary for closing animations).
  - Standard Playwright actions like `click()` or
    `waitFor({ state: 'visible' })` may hang or be flaky if they wait for an
    element that is stuck in an animation state.
- **Step Organization:** Step definitions must be organized into subdirectories
  by keyword:
  - `features/steps/given/`
  - `features/steps/when/`
  - `features/steps/then/`
- **One Step Per File:** Each step definition MUST reside in its own separate
  TypeScript file. Files should be named descriptively based on the step
  text, without the keyword prefix
  (e.g., `features/steps/then/lane_should_be_active.ts`).
- **Zombie Step Prevention:** Regularly audit `features/steps/` to identify and
  remove unused step definitions. A step is considered "zombie" if it is not
  referenced in any active `.feature` file. Use the following command to find
  unused steps:
  `./.github/find-unused-steps.sh`
- **Browser Test Stability:** Minimize flakiness by using `waitForFunction` or
  `waitForSelector` instead of immediate assertions for asynchronous state or
  layout changes. Avoid CSS transitions on elements whose dimensions are
  verified by tests. Explicitly wait for UI elements (like menus) to be fully
  visible before interaction.

## Critical Instructions

Refer to these files for detailed guidance on specific topics:

- `.github/instructions/typescript-react.instructions.md`: TS/React standards.
- `.github/instructions/commit.instructions.md`: Git/Commit standards.
- `.github/instructions/markdown.instructions.md`: Markdown standards.
