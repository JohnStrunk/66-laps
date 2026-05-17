# Auditing — Reference

This document describes the audit script (`scripts/audit.py`) and
how to use it to verify the quality and consistency of your EARS
requirements, Gherkin scenarios, and step definitions.

---

## When to Audit

**After every change.** Run the audit script proactively as the
final step of the development workflow — do not wait to be asked.
Specifically:

- After creating or modifying a `.feature` file
- After creating or modifying a step definition file
- After deleting or renaming step files
- Before considering any work complete

---

## Usage

```bash
# Audit everything (specs + steps)
python scripts/audit.py features/

# Audit only .feature file structure
python scripts/audit.py features/ --specs-only

# Audit only step definition files
python scripts/audit.py features/ --steps-only

# Specify BDD framework (auto-detected if not given)
python scripts/audit.py features/ --framework behave
python scripts/audit.py features/ --framework cucumber-js
```

The script exits with code 0 if all checks pass, 1 if any findings
are reported.

---

## Spec Checks

The spec audit validates `.feature` file structure against the
EARS-Gherkin mapping rules:

| Check | What it catches |
| :--- | :--- |
| Rule has exactly one "shall" | Missing or compound EARS requirements |
| No wrong obligation keywords | "should", "may", "will", "must" in Rule titles |
| No vague language | Unmeasurable adverbs, adjectives, quantifiers |
| Correct EARS structure | Mismatched keywords (When for states, etc.) |
| Explicit system name | Pronouns ("it") before "shall" |
| Clean Rule descriptions | Additional EARS requirements in freeform text |
| Scenario coverage | Rules with no scenarios |
| Scenarios inside Rules | Scenarios outside any Rule block |

### Common Spec Findings and Fixes

**"Rule title contains 2 occurrences of 'shall'"** — The
requirement is compound. Split it into two `Rule:` blocks, each
with one "shall."

**"Rule title uses non-standard obligation keyword: should"** —
Replace "should" with "shall."

**"Rule title contains vague language: 'quickly'"** — Replace
with a measurable value (e.g., "within 200 milliseconds").

**"No scenarios found under this rule"** — Write at least one
scenario demonstrating the requirement.

---

## Step Checks

The step audit validates step definition file organization using
the BDD framework's dry-run output. It delegates step matching to
the actual framework, so it uses the same matching logic your
tests use.

| Check | What it catches |
| :--- | :--- |
| Missing step definitions | Steps in `.feature` files with no match |
| Unused step files | Step files not matched by any scenario |
| Multiple steps per file | Files containing more than one step def |
| Step file naming | Filenames that don't match step patterns |
| Near-duplicate files | Similar filenames (consolidation candidates) |
| Keyword directory structure | Files not in `given/`, `when/`, `then/` |

### Common Step Findings and Fixes

**"MISSING: Given the user is logged in"** — Create a new step
file in `features/steps/given/the_user_is_logged_in.py` (or
equivalent for your framework).

**"UNUSED: features/steps/when/old_step.py"** — The step is not
used by any scenario. Delete the file or update scenarios to use
it.

**"MULTI-STEP: features/steps/given/setup.py contains 3
steps"** — Split into three files, one per step, each named after
its step.

**"NAMING: features/steps/given/step1.py should be
the_shopping_cart_is_empty.py"** — Rename the file to match the
step pattern it contains.

**"75% similar: add_to_cart.py / add_item_to_cart.py"** — These
may be candidates for consolidation into one parameterized step.

---

## Supported Frameworks

| Framework | Detection | Dry-run command |
| :--- | :--- | :--- |
| Behave (Python) | `environment.py` or `.py` step files | `uvx behave --dry-run` |
| Cucumber-JS | `cucumber.*` config or `.js/.ts` step files | `npx @cucumber/cucumber --dry-run` |

The framework is auto-detected from project structure. Use
`--framework` to override if detection fails.

---

## Reading the Report

The audit report has sections for each check category. Each
finding is prefixed with a category tag:

- `MISSING:` — Step definition needed
- `UNUSED:` — Step file can be deleted
- `MULTI-STEP:` — File needs splitting
- `NAMING:` — File needs renaming
- `DUPLICATE:` — Consolidation candidate
- `ORGANIZATION:` — File not in keyword directory

The summary at the end shows total findings and a pass/fail
verdict.
