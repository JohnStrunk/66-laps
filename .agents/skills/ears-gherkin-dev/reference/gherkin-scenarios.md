# Gherkin Scenario Writing — Detailed Reference

This document provides comprehensive guidance for writing high-quality Gherkin
scenarios. Consult this when creating scenarios for EARS requirements.

---

## The Golden Rule

Write scenarios so that someone who has never seen the feature can understand
the behavior being described. A scenario should read like a clear, concise
story — no technical jargon, no implementation details, no incidental data.

---

## Declarative vs. Imperative Style

This is the most important stylistic choice. **Always use declarative style.**

### Imperative Style (avoid)

Step-by-step UI instructions that specify *how* the user interacts with the
system. These are brittle — they break when the UI changes even if the
behavior stays the same.

```gherkin
# BAD: Imperative — coupled to UI mechanics
Scenario: User logs in
  Given I visit "/login"
  When I enter "alice@example.com" in the "email" field
  And I enter "s3cret" in the "password" field
  And I press the "Login" button
  Then I should see the text "Welcome, Alice"
  And I should see a link labeled "My Account"
```

### Declarative Style (use this)

Higher-level statements describing *what* happens and *why* it matters. The
technical details live in step definitions, not in the scenario.

```gherkin
# GOOD: Declarative — focused on behavior
Scenario: Registered user can access their account
  Given Alice is a registered user
  When Alice logs in with valid credentials
  Then Alice should see her account dashboard
```

### How to Tell the Difference

Ask: *"Would this wording need to change if the implementation changed?"* If
the login moved from a form to biometric authentication, the imperative
version breaks. The declarative version still works.

### Why Declarative Wins

- Remains valid when the UI or implementation changes
- Shorter and easier to read
- Focuses on business value, not mechanics
- Step definitions handle the technical details
- Better living documentation for non-technical stakeholders

---

## One Scenario, One Behavior

Each scenario should test exactly one behavior. It should have a single
`When`-`Then` pair (each may have `And`/`But` continuations).

```gherkin
# BAD: Multiple behaviors crammed into one scenario
Scenario: Full user journey
  Given the user is on the home page
  When the user registers
  Then the user should see a confirmation
  When the user logs in
  Then the user should see the dashboard
  When the user changes their password
  Then the user should see a success message

# GOOD: Each behavior is its own scenario
Scenario: New user can register
  Given a visitor on the registration page
  When the visitor completes the registration form
  Then a confirmation message is displayed

Scenario: Registered user can log in
  Given a registered user
  When the user logs in with valid credentials
  Then the dashboard is displayed

Scenario: User can change their password
  Given a logged-in user
  When the user changes their password
  Then a success message is displayed
```

If you find yourself writing a second `When` after a `Then`, you have two
scenarios.

---

## Step Writing Guidelines

### Given — Establish Context

Givens describe the **initial state** before the behavior occurs. They are
preconditions, not actions.

```gherkin
# BAD: Givens that describe actions
Given the user navigates to the login page
Given the user clicks "Premium"

# GOOD: Givens that describe state
Given the user has a premium subscription
Given the product catalog contains 50 items
Given the user is logged in
```

- Use past tense or present state descriptions
- Set up only context relevant to this scenario
- Multiple Givens are fine with `And`/`But`

### When — Perform the Action

The event or action that triggers the behavior being tested. This is the
pivot point of the scenario.

```gherkin
# BAD: Technology-specific
When I click the button with id "submit-order"
When I send a POST request to /api/orders

# GOOD: Behavior-focused
When the customer places an order
When the user submits the search query
```

- There should be a **single logical action** per scenario
- Describe *what* happens, not *how*
- Avoid CSS selectors, API endpoints, or framework-specific details

### Then — Verify the Outcome

The **expected outcome** — what an observer would see.

```gherkin
# BAD: Checking implementation internals
Then the database should have a new row in the orders table
Then OrderService.processOrder() should have been called

# GOOD: Checking observable outcomes
Then the customer should receive an order confirmation
Then the order should appear in the customer's order history
```

- Verify outputs observable by users or external systems
- Avoid checking database state, internal variables, or method calls
- Multiple Thens are fine for different aspects of the same outcome

### Step Order

Steps must appear in order: **Given → When → Then**

- No `Given` after a `When` or `Then`
- No `When` after a `Then`
- `And` and `But` inherit the type of the preceding step

---

## Scenario Outlines

Scenario Outlines (also called Scenario Templates) run the same scenario
multiple times with different data. Use them for boundary values, equivalence
classes, and input variations.

### When to Use

- Multiple examples illustrate the **same behavior** with different inputs
- You need to cover several equivalence classes of the same rule
- The scenario structure is identical — only the data varies

### When NOT to Use

- Different rows represent **different behaviors** (use separate scenarios)
- Only one example row exists (use a plain Scenario)
- The table has so many columns it becomes unreadable
- Rows combine unrelated test cases that happen to share similar structure

### Good Example

```gherkin
Scenario Outline: Password validation enforces minimum requirements
  Given the user is creating an account
  When the user enters a password "<password>"
  Then the system should display "<result>"

  Examples:
    | password   | result                                  |
    | ab         | Password must be at least 8 characters  |
    | abcdefgh   | Password accepted                       |
    | Abcdef1!   | Password accepted                       |
```

### Named Examples Blocks

Use named `Examples` blocks to document what each group of rows tests:

```gherkin
Scenario Outline: Shipping cost depends on order total
  Given the customer has items totaling $<total> in their cart
  When the customer proceeds to checkout
  Then the shipping cost should be $<shipping>

  Examples: Free shipping (orders $100+)
    | total  | shipping |
    | 100.00 | 0.00     |
    | 250.00 | 0.00     |

  Examples: Standard shipping
    | total | shipping |
    | 25.00 | 5.99     |
    | 49.99 | 5.99     |
```

### Bad Example — Different Behaviors Forced Into an Outline

```gherkin
# BAD: Each row is a fundamentally different behavior
Scenario Outline: User actions
  Given a <user_type> user
  When the user <action>
  Then <outcome>

  Examples:
    | user_type | action              | outcome                     |
    | admin     | deletes a user      | user is removed             |
    | guest     | views the home page | public content is shown     |
    | banned    | tries to log in     | access denied message shown |

# These are three different behaviors — write three separate scenarios.
```

---

## Property-Based Testing

Where practical, use property-based testing to provide broader
coverage than example-only scenarios. Instead of checking specific
input-output pairs, property-based tests verify that a property or
invariant holds across many inputs.

### When to Use

- The requirement states a general rule that should hold for any
  valid input (e.g., "all passwords must be at least 8 characters")
- Boundary conditions are numerous or non-obvious
- The behavior is mathematical or algorithmic (sorting, filtering,
  calculations)
- Example-based testing would require many rows to cover the input
  space adequately

### When NOT to Use

- The behavior is inherently example-driven (specific error messages
  for specific inputs)
- The number of valid inputs is small and enumerable
- The property is harder to express than the examples

### Expressing Properties in Gherkin

Use Scenario Outlines with generated or representative data, and
write Then steps that assert properties rather than exact values:

```gherkin
Rule: When the user submits a search query, the search service shall return only results matching the query.

  Scenario Outline: Search results match the query term
    Given the product catalog contains diverse products
    When the user searches for "<query>"
    Then every result should contain "<query>" in its name
      or description
    And no result should be unrelated to "<query>"

    Examples: Representative queries across categories
      | query       |
      | headphones  |
      | running     |
      | organic     |
      | bluetooth   |
      | waterproof  |
```

### Property Assertions in Step Definitions

The Then step asserts a **property** (every result matches) rather
than a **specific value** (result #1 is "Sony Headphones"). The step
definition should:

1. Retrieve the full result set
2. Assert the property holds for every item
3. Provide a clear failure message identifying which item violated
   the property

```text
# Pseudocode — framework-agnostic
def step_every_result_matches(context, query):
    for result in context.search_results:
        assert query.lower() in result.name.lower()
            or query.lower() in result.description.lower(),
            f"Result '{result.name}' does not match '{query}'"
```

### Combining with Scenario Outlines

Scenario Outlines are the natural Gherkin vehicle for property-based
testing. Use named Examples blocks to organize inputs by category:

```gherkin
Rule: The pricing engine shall apply the correct discount tier based on order total.

  Scenario Outline: Discount tier is correct for order total
    Given a customer with no special promotions
    When the customer places an order totaling $<total>
    Then the discount should be <discount>%
    And the final price should equal $<total> minus <discount>%

    Examples: No discount (under $50)
      | total | discount |
      | 10.00 | 0        |
      | 49.99 | 0        |

    Examples: Silver tier ($50-$99.99)
      | total | discount |
      | 50.00 | 5        |
      | 75.00 | 5        |

    Examples: Gold tier ($100+)
      | total  | discount |
      | 100.00 | 10       |
      | 500.00 | 10       |
```

The property being tested: the discount percentage is determined
solely by which tier the order total falls into. The Then step
verifies both the tier assignment and the arithmetic.

---

## Background Blocks

A `Background` runs before each scenario in its scope (feature or rule). It
reduces repetition of shared `Given` steps.

### When to Use

- **Every** scenario in the scope shares the same setup
- The background steps provide essential context for understanding each
  scenario
- Extracting shared setup makes each scenario shorter and more focused

### When NOT to Use

- Only some scenarios need the setup (use individual Givens)
- It exceeds 4-5 lines (too much shared state obscures meaning)
- It contains `When` or `Then` steps (Background is for Givens only)
- It sets up state that not all scenarios need

### Good Example

```gherkin
Feature: Premium Content Access

  Background:
    Given a user with an active premium subscription

  Scenario: Premium user can view exclusive articles
    When the user opens an exclusive article
    Then the full article content is displayed

  Scenario: Premium user can download reports
    When the user downloads a quarterly report
    Then the report is saved to their downloads
```

### Background Within a Rule

In the EARS-Gherkin structure, `Background` is particularly useful inside
`Rule` blocks, where all scenarios share the same EARS preconditions:

```gherkin
Rule: While the system is in maintenance mode, the system shall reject new user logins.

  Background:
    Given the system is in maintenance mode

  Scenario: Login attempt is rejected during maintenance
    When a user attempts to log in with valid credentials
    Then the system should reject the login
    And display "System is under maintenance. Please try again later."

  Scenario: Login succeeds after maintenance ends
    Given maintenance mode has been deactivated
    When a user attempts to log in with valid credentials
    Then the login should succeed
```

### Keep It Short

The Background should be short enough that readers can hold it in their head
while reading any scenario. If you have to keep scrolling back, it's too
complex.

---

## Data Tables

Data Tables pass structured data to a single step. They differ from Scenario
Outline Examples tables — Data Tables provide data within one scenario run;
Examples tables run the entire scenario multiple times.

### When to Use

- Providing a list of items to a step
- Specifying object properties compactly
- Setting up multiple entities at once

### Examples

```gherkin
# Setting up multiple entities
Given the following products exist:
  | name                | price  | category    |
  | Wireless Headphones | 79.99  | Electronics |
  | Running Shoes       | 129.99 | Sports      |

# Specifying properties
When the user creates an account with:
  | first name | Alice             |
  | last name  | Smith             |
  | email      | alice@example.com |
```

### Guidelines

- Align pipe characters vertically for readability
- Use a header row for named columns
- Keep columns to 3-5 maximum
- Only include columns relevant to the behavior being tested

---

## Doc Strings

Doc Strings pass multi-line text to a step. Use triple-quoted blocks
(``` or """) for error messages, JSON payloads, email content, or any
multi-line output.

```gherkin
Scenario: API returns an error response
  Given an unauthenticated request
  When the client calls the protected endpoint
  Then the response body should be:
    """json
    {
      "error": "unauthorized",
      "message": "Valid authentication credentials are required"
    }
    """
```

---

## Scenario Naming

Scenario names should describe the specific behavior being demonstrated.

```gherkin
# BAD: Vague or procedural names
Scenario: Test 1
Scenario: It works
Scenario: Click login then enter credentials

# GOOD: Behavior-focused names
Scenario: Registered user logs in with valid credentials
Scenario: Expired subscription prevents access to premium content
Scenario: Empty cart displays a prompt to continue shopping
```

---

## Tags

Tags organize and filter scenarios. In the EARS-Gherkin structure, tags can
categorize requirements by type, priority, or concern.

### Useful Tag Patterns

```gherkin
# By EARS pattern type
@ubiquitous
@event-driven
@unwanted-behavior

# By concern
@security
@performance
@accessibility

# By priority
@priority-high
@must-have

# By status
@wip
@pending-review
```

### Tag Inheritance

Tags on a `Feature` are inherited by all scenarios. Tags on a `Rule` are
inherited by all scenarios within that rule.

```gherkin
@authentication
Feature: User Login

  @security
  Rule: If the password is entered incorrectly three times, then the authentication system shall lock the account for 30 minutes.

    @smoke
    Scenario: Account locks on third failure
      ...
    # This scenario inherits @authentication, @security, and has @smoke
```

---

## Common Anti-Patterns

### Incidental Details

Including data irrelevant to the behavior being tested.

```gherkin
# BAD: Full of irrelevant details
Scenario: Customer receives loyalty points
  Given a customer named "Jane Doe" born on "1990-05-15"
  And the customer has email "jane@example.com"
  And the customer's phone is "555-0199"
  And the customer has been a member since "2020-01-01"
  When the customer makes a purchase of $50.00
  Then the customer should receive 50 loyalty points

# GOOD: Only what matters
Scenario: Customer earns one loyalty point per dollar spent
  Given an enrolled loyalty member
  When the member makes a purchase of $50.00
  Then the member should earn 50 loyalty points
```

### Testing Implementation Details

Referencing database tables, API endpoints, CSS selectors, or framework
internals.

```gherkin
# BAD: Leaking implementation
Scenario: Add item to cart
  Given a row exists in the "products" table with id 42
  When I POST to "/api/v2/cart" with body '{"product_id": 42}'
  Then the "cart_items" table should have 1 row

# GOOD: Behavior-focused
Scenario: Adding a product to the cart
  Given "Wireless Headphones" is available in the store
  When the customer adds "Wireless Headphones" to their cart
  Then the cart should contain "Wireless Headphones"
```

### Procedure-Driven Scenarios

Sequential test scripts tracing through multiple behaviors.

```gherkin
# BAD: Multiple behaviors as a procedure
Scenario: Complete user workflow
  Given the user registers
  Then confirmation shown
  When the user logs in
  Then dashboard shown
  When the user updates profile
  Then success message shown

# GOOD: Split into separate scenarios (see "One Scenario, One Behavior")
```

### Coupled Scenarios

Scenarios that depend on each other's state or execution order. Every
scenario should be independently runnable.

```gherkin
# BAD: Scenario 2 depends on Scenario 1 having run
Scenario: Create a product
  When the admin creates product "Widget"
  Then "Widget" should exist

Scenario: Delete the product
  When the admin deletes product "Widget"   # assumes previous scenario ran
  Then "Widget" should not exist

# GOOD: Each scenario sets up its own state
Scenario: Admin can delete a product
  Given the product "Widget" exists
  When the admin deletes product "Widget"
  Then "Widget" should no longer be listed
```

### Too Many Steps

If a scenario exceeds ~10 steps, it likely covers too much or is too
imperative:

1. Does it cover multiple behaviors? → Split it
2. Is it imperative where declarative would work? → Raise abstraction
3. Do setup steps repeat across scenarios? → Extract to `Background`
4. Can details move to step definitions? → Push them down

Target 3-5 steps per scenario. A clean Given-When-Then triplet is often
ideal.

### Near-Duplicate Steps

Multiple steps that differ only by a noun or value, each requiring its own
step definition. Consolidate them into a single parameterized step.

```gherkin
# BAD: Three steps that only differ by field name
Scenario: User completes their profile
  Given the user is on the profile page
  When the user enters their email
  And the user enters their phone number
  And the user enters their mailing address
  Then the profile should be saved

# GOOD: One parameterized step handles all three
Scenario: User completes their profile
  Given the user is on the profile page
  When the user enters their "email"
  And the user enters their "phone number"
  And the user enters their "mailing address"
  Then the profile should be saved
```

The bad version requires three nearly identical step definitions. The good
version uses one step definition with a parameter, reducing duplication and
making it easy to add new fields without writing new steps.

**When NOT to consolidate:** Keep steps separate when the *behavior* differs,
not just the data. "the user uploads a photo" and "the user enters their
name" involve different interactions and should remain distinct steps, even
though both populate profile fields.

---

## Mapping EARS Patterns to Scenario Structure

Each EARS pattern produces a characteristic scenario shape:

### Ubiquitous → Multiple Invariant Scenarios

The requirement is always true, so test it across multiple contexts:

```gherkin
Rule: The API shall return responses in JSON format.

  Scenario: GET request returns JSON
    Given the API is running
    When a client sends a GET request to a resource endpoint
    Then the response Content-Type should be "application/json"

  Scenario: POST request returns JSON
    Given the API is running
    When a client sends a POST request with valid data
    Then the response Content-Type should be "application/json"
```

### Event-Driven → Trigger-and-Verify

```gherkin
Rule: When the user submits a search query, the search service shall return results within 200 milliseconds.

  Scenario: Search returns results within time limit
    Given the product catalog contains indexed items
    When the user submits a search for "headphones"
    Then search results should be displayed
    And the response time should be under 200 milliseconds
```

### State-Driven → State Active + State Inactive

Test both that the behavior is active during the state AND inactive outside
it:

```gherkin
Rule: While the system is in maintenance mode, the system shall reject new user logins.

  Scenario: Login rejected during maintenance
    Given the system is in maintenance mode
    When a user attempts to log in
    Then the login should be rejected

  Scenario: Login accepted outside maintenance
    Given the system is in normal operating mode
    When a user attempts to log in with valid credentials
    Then the login should succeed
```

### Unwanted Behavior → Negative/Fault-Injection

Deliberately create the unwanted condition and verify the response:

```gherkin
Rule: If the password is entered incorrectly three times, then the authentication system shall lock the account for 30 minutes.

  Scenario: Account locks after three failures
    Given a user has failed login twice
    When the user fails login a third time
    Then the account should be locked for 30 minutes

  Scenario: Two failures do not lock the account
    Given a user has failed login twice
    When the user logs in with the correct password
    Then the login should succeed
    And the failure counter should be reset

  Scenario: Account unlocks after 30 minutes
    Given a locked account
    When 30 minutes have elapsed
    Then the account should be unlocked
```

### Optional Feature → Feature On + Feature Off

Test both configurations:

```gherkin
Rule: Where two-factor authentication is enabled, the system shall prompt for a verification code after password entry.

  Scenario: 2FA prompt shown when enabled
    Given the user has two-factor authentication enabled
    When the user enters valid credentials
    Then the system should prompt for a verification code

  Scenario: No 2FA prompt when disabled
    Given the user does not have two-factor authentication enabled
    When the user enters valid credentials
    Then the system should grant access directly
```

---

## Scenario Count Guidelines

- **Per Rule block:** Aim for 2-5 scenarios per EARS requirement. Cover the
  happy path, key boundary conditions, and the most important negative case.
  Exhaustive edge-case testing belongs at the unit/integration level.
- **Per Feature file:** A feature with 30+ scenarios likely needs to be split
  or reorganized. Around a dozen is a good target.
- Each scenario should earn its place — ask whether it tests a genuinely
  distinct aspect of the requirement.
