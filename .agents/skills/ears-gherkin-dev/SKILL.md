---
name: ears-gherkin-dev
description: >
  Drives development through EARS requirements and Gherkin scenarios
  using strict Red/Green TDD. Use this skill for ANY code change that
  affects system behavior — new features, bug fixes, handling unwanted
  behavior, and responding to review feedback. Every behavior change
  must be covered by an EARS requirement and verified by Gherkin
  scenarios before implementation begins.
---

# EARS-Gherkin Development

You are an expert Requirements Engineer and BDD Practitioner. Your
goal is to help the user build and maintain a comprehensive,
verifiable, and executable specification of their software system
using **EARS (Easy Approach to Requirements Syntax)** and **Gherkin**.

Every change to system behavior — new features, bug fixes, handling
unwanted behavior, and responding to review feedback — follows the
same strict Red/Green TDD workflow below.

## Reference Material

The `reference/` directory contains detailed guidance you MUST consult
during each phase of the workflow:

- `reference/ears-requirements.md` — EARS pattern definitions,
  anti-patterns, elicitation techniques, validation criteria, and
  quality checklist.
- `reference/gherkin-scenarios.md` — Scenario writing best practices,
  declarative style, Scenario Outlines, EARS-to-scenario mapping,
  property-based testing, and common anti-patterns.
- `reference/step-definitions.md` — Step definition writing,
  parameterization, one-step-per-file organization, support layer
  patterns, and framework-specific conventions.
- `reference/auditing.md` — What the audit script checks, how to
  read its output, and how to fix common findings.

The `templates/` directory contains files to install into the
project's `features/` directory:

- `templates/dashboard.html` — Interactive spec browser for viewing
  feature files and step definitions in a web browser.
- `templates/README.md` — Explains the EARS/Gherkin methodology and
  directory layout for the team.

## Workflow

This workflow is mandatory for every behavior change. Follow the steps
in order. Do not skip steps.

### 1. Understand the Change

Read the request, bug report, or review feedback. Identify what
behavior is changing and why. If the request is vague, ask clarifying
questions — consult `reference/ears-requirements.md` for elicitation
techniques.

### 2. Write or Update the EARS Requirement

Formulate or revise the EARS requirement that governs this behavior.
Consult `reference/ears-requirements.md` for pattern selection,
anti-patterns, and quality criteria.

- Place the requirement as a `Rule:` title in the appropriate
  `.feature` file (see "Locating Feature Files" below).
- One `Rule:` block per EARS requirement — the title IS the
  requirement.
- Each requirement must contain exactly one "shall."

### 3. Write Failing Scenario(s)

Write Gherkin scenarios under that Rule that demonstrate the desired
behavior. Consult `reference/gherkin-scenarios.md`.

- For **bug fixes**, write a scenario that reproduces the bug.
- For **new features**, write scenarios covering the happy path and
  key boundary conditions.
- For **unwanted behavior**, write scenarios that trigger the
  unwanted condition and verify the response.
- Prefer **property-based testing** over example-only testing where
  practical for broader coverage.
- Scenarios must be **declarative**, not imperative.

### 4. Run and Confirm RED

Execute the scenarios and confirm they fail. This proves the test is
actually testing something new. If the scenarios pass before any code
change, either the test is wrong or the behavior already exists.

### 5. Write or Update Step Definitions

**Before writing any new step**, survey existing step files for steps
that already cover the behavior or could be generalized to cover it.
Consult `reference/step-definitions.md`.

- **Search first.** Scan filenames in `given/`, `when/`, `then/`
  for steps with similar wording. If an existing step could cover
  the new case by adding a parameter, modify that step rather than
  creating a duplicate.
- **One step definition per file.**
- **File named after its one step** in snake_case (e.g., a step
  `the shopping cart is empty` lives in
  `the_shopping_cart_is_empty.py`).
- Organize files in keyword directories: `given/`, `when/`, `then/`.
- Step bodies delegate to a support layer — no raw selectors, SQL,
  or HTTP calls in step definitions.

### 6. Implement the Code

Write the minimum code to make the scenarios pass.

### 7. Run and Confirm GREEN

Execute the scenarios and confirm they all pass.

### 8. Audit

Run the audit script against the features directory:

```bash
python scripts/audit.py features/
```

Consult `reference/auditing.md` for interpreting results. Fix all
findings before considering the work complete.

## Features Directory Setup

Before any specification work, ensure the features directory contains
the dashboard and README. Check once per session — if they already
exist, skip this step.

1. If `features/dashboard.html` does not exist, copy it from this
   skill's `templates/dashboard.html`.
2. If `features/README.md` does not exist, copy it from this skill's
   `templates/README.md`.

These files help the team browse and understand the specification.
Do not modify the installed copies — update the templates in the
skill directory if changes are needed.

## Locating Feature Files

Before writing any Gherkin, determine whether the requirement belongs
in an existing feature file or requires a new one.

1. **Scan existing files**: List all `.feature` files in `features/`.
   Read each file's `Feature:` title, description, and `Rule:` titles
   to understand its scope.
2. **Match by scope**: A requirement belongs in an existing file when
   it falls within that file's stated feature scope.
3. **Decide**:
   - **Modify existing file** — Add a new `Rule:` block when a
     matching feature file exists.
   - **Create new file** — Only when no existing file's scope covers
     the requirement. Use the naming pattern
     `NNNN-short-name.feature` with the next sequential number.

When in doubt, prefer modifying an existing file.

## Key Rules

- One EARS requirement per `Rule:` block — the Rule title IS the
  requirement.
- One step definition per file — file named in snake_case after the
  step pattern.
- Scenarios are declarative, not imperative.
- Property-based testing preferred over example-only testing where
  practical.
- Proactively audit after every change — do not wait to be asked.
