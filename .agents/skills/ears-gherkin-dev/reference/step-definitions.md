# Step Definitions — Comprehensive Reference

This document consolidates all guidance for writing, organizing,
and maintaining Gherkin step definitions. Consult this when creating,
reviewing, or refactoring step implementation code.

---

## Core Principle: One Step Per File

This is non-negotiable. Every step definition lives in its own file.
A file with two or more steps is an audit failure.

This makes each step independently discoverable, auditable, and
version-controlled:

- An unused step is an unused file — easy to spot and delete.
- Adding a step means adding a file — no merge conflicts in shared
  files.
- Each file has a single responsibility — open it, see one step,
  done.

---

## Directory Structure

Step files are organized into directories by their Gherkin keyword
type.

### Typical Layout

```text
project/
├── features/                          ← .feature files
│   ├── authentication.feature
│   ├── shopping_cart.feature
│   └── checkout.feature
├── features/steps/                    ← Step definitions
│   ├── given/                         ← All Given step files
│   │   ├── a_registered_user.py
│   │   ├── the_shopping_cart_is_empty.py
│   │   └── the_shopping_cart_contains_items.py
│   ├── when/                          ← All When step files
│   │   ├── the_customer_adds_to_the_cart.py
│   │   ├── the_customer_removes_from_the_cart.py
│   │   └── the_user_logs_in.py
│   └── then/                          ← All Then step files
│       ├── the_cart_should_display_items.py
│       ├── the_cart_total_should_be.py
│       └── the_dashboard_should_appear.py
├── support/                           ← Helper/support modules
│   ├── pages/                         ← Page objects (UI testing)
│   │   ├── login_page.py
│   │   └── cart_page.py
│   ├── api_client.py
│   ├── database.py
│   └── factories.py
└── environment.py                     ← Hooks
```

### File Naming Convention

Derive the filename from the step pattern:

1. Take the step text (e.g., `the customer adds "{product}" to
   the cart`)
2. Remove quotes and parameter placeholders →
   `the customer adds to the cart`
3. Convert to snake_case →
   `the_customer_adds_to_the_cart`
4. Add the framework's file extension →
   `the_customer_adds_to_the_cart.py`

| Step Pattern | Filename |
| :--- | :--- |
| `a registered user named "{name}"` | `a_registered_user_named.py` |
| `the shopping cart is empty` | `the_shopping_cart_is_empty.py` |
| `the cart should display {count} items` | `the_cart_should_display_items.py` |
| `the user enters "{value}" into the "{field}" field` | `the_user_enters_into_the_field.py` |

### What Goes in Each File

A step file contains exactly one step definition and any imports
it needs. Nothing else.

```python
# features/steps/given/the_shopping_cart_is_empty.py
from behave import given
from support.cart_helper import ShoppingCart

@given("the shopping cart is empty")
def step_impl(context):
    context.cart = ShoppingCart()
```

```python
# features/steps/when/the_customer_adds_to_the_cart.py
from behave import when

@when('the customer adds "{product_name}" to the cart')
def step_impl(context, product_name):
    context.cart.add_item(product_name)
```

### Framework-Specific Conventions

| Framework | Steps Root | Given | When | Then |
| :--- | :--- | :--- | :--- | :--- |
| **Behave** | `features/steps/` | `given/` | `when/` | `then/` |
| **pytest-bdd** | `tests/step_defs/` | `given/` | `when/` | `then/` |
| **Cucumber (JS)** | `features/step_definitions/` | `given/` | `when/` | `then/` |
| **Cucumber (Java)** | `src/test/java/steps/` | `given/` | `when/` | `then/` |
| **Cucumber (Ruby)** | `features/step_definitions/` | `given/` | `when/` | `then/` |
| **SpecFlow** | `StepDefinitions/` | `Given/` | `When/` | `Then/` |
| **Godog** (Go) | `features/steps/` | `given/` | `when/` | `then/` |

For Python frameworks (Behave, pytest-bdd), Behave only loads step
files from `features/steps/` by default — it does not recurse into
subdirectories. To enable discovery of steps in `given/`, `when/`,
and `then/` subdirectories, add a `features/steps/__init__.py`
that auto-imports them:

```python
# features/steps/__init__.py
import glob
import importlib.util
import os

_steps_dir = os.path.dirname(__file__)
for _subdir in ("given", "when", "then"):
    _subdir_path = os.path.join(_steps_dir, _subdir)
    if not os.path.isdir(_subdir_path):
        continue
    for _filepath in sorted(glob.glob(os.path.join(_subdir_path, "*.py"))):
        _basename = os.path.basename(_filepath)
        if _basename.startswith("_"):
            continue
        _spec = importlib.util.spec_from_file_location(_basename[:-3], _filepath)
        _mod = importlib.util.module_from_spec(_spec)
        _spec.loader.exec_module(_mod)
```

Also include an empty `__init__.py` in each keyword subdirectory.

#### Godog (Go) — One Step Per File

Godog (`github.com/cucumber/godog`) is the official Cucumber
framework for Go. Step definitions live in `*_test.go` files and
are registered via an `InitializeScenario` function. This requires
a slightly different approach to one-step-per-file than
decorator-based frameworks.

**Directory layout:**

```text
project/
├── features/                          ← .feature files
│   └── shopping_cart.feature
├── features/steps/                    ← Step definition files
│   ├── given/
│   │   ├── the_shopping_cart_is_empty_test.go
│   │   └── the_shopping_cart_contains_items_test.go
│   ├── when/
│   │   └── the_customer_adds_to_the_cart_test.go
│   └── then/
│       ├── the_cart_should_display_items_test.go
│       └── the_cart_total_should_be_test.go
├── support/                           ← Helper modules
│   └── cart.go
├── steps_test.go                      ← InitializeScenario (registers all steps)
├── go.mod
└── go.sum
```

Each step file defines one exported step function. A central
`steps_test.go` registers them all:

```go
// features/steps/given/the_shopping_cart_is_empty_test.go
package steps

import (
    "context"
    "myproject/support"
)

func TheShoppingCartIsEmpty(ctx context.Context) (context.Context, error) {
    cart := support.NewCart()
    return context.WithValue(ctx, support.CartKey{}, cart), nil
}
```

```go
// steps_test.go
package myproject_test

import (
    "testing"

    "github.com/cucumber/godog"

    "myproject/features/steps/given"
    "myproject/features/steps/when"
    "myproject/features/steps/then"
)

func InitializeScenario(ctx *godog.ScenarioContext) {
    ctx.Given(`^the shopping cart is empty$`, given.TheShoppingCartIsEmpty)
    ctx.When(`^the customer adds "([^"]*)" to the cart$`, when.TheCustomerAddsToTheCart)
    ctx.Then(`^the cart should display (\d+) items?$`, then.TheCartShouldDisplayItems)
}

func TestFeatures(t *testing.T) {
    suite := godog.TestSuite{
        ScenarioInitializer: InitializeScenario,
        Options: &godog.Options{
            Format:   "pretty",
            Paths:    []string{"features"},
            TestingT: t,
        },
    }
    if suite.Run() != 0 {
        t.Fatal("feature tests failed")
    }
}
```

Adding a new step means creating a new `*_test.go` file and adding
one registration line to `InitializeScenario`.

**State management in Go:** Godog uses Go's `context.Context` with
typed keys rather than a world object. Each step receives the
context and returns an updated copy:

```go
type CartKey struct{}

func TheShoppingCartIsEmpty(ctx context.Context) (context.Context, error) {
    return context.WithValue(ctx, CartKey{}, support.NewCart()), nil
}

func TheCustomerAddsToTheCart(ctx context.Context, product string) (context.Context, error) {
    cart := ctx.Value(CartKey{}).(*support.Cart)
    cart.Add(product)
    return ctx, nil
}
```

---

## The Three-Layer Model

Step definitions are translators — they convert scenario language
into code. The step definition itself should be a thin layer that
delegates to a support/helper module where the real implementation
lives.

### Why It Matters

When implementation details live in step definitions, changes to
the system under test force changes across many step files. When
steps delegate to a support layer, changes are isolated to that
layer.

### The Three Layers

```text
Feature file (Gherkin)     → What the system does (business language)
Step definitions           → Wiring layer (maps words to code)
Support/helper modules     → How to interact with the system (implementation)
```

### Before and After

**Before — implementation details in the step (JS/Cucumber):**

```javascript
When('the customer places an order', async function () {
  await this.page.goto('/cart');
  await this.page.click('[data-testid="checkout-btn"]');
  await this.page.fill('#card-number', '4111111111111111');
  await this.page.fill('#expiry', '12/25');
  await this.page.fill('#cvv', '123');
  await this.page.click('#submit-order');
  await this.page.waitForSelector('.order-confirmation');
  this.orderId = await this.page.textContent('.order-id');
});
```

**After — step delegates to support layer:**

```javascript
When('the customer places an order', async function () {
  this.orderId = await this.checkout.placeOrderWithTestPayment();
});
```

The checkout page object handles the DOM interaction, selectors,
and payment details. If the checkout flow changes, only the page
object needs updating — every scenario that places an order
continues to work.

**Go/Godog — same principle applies:**

```go
// Before — HTTP details in the step
func theCustomerPlacesAnOrder(ctx context.Context) (context.Context, error) {
    body, _ := json.Marshal(map[string]any{"items": cartFromCtx(ctx).Items})
    resp, err := http.Post("http://localhost:8080/orders", "application/json",
        bytes.NewReader(body))
    if err != nil { return ctx, err }
    defer resp.Body.Close()
    var order Order
    json.NewDecoder(resp.Body).Decode(&order)
    return context.WithValue(ctx, OrderKey{}, &order), nil
}

// After — step delegates to support layer
func theCustomerPlacesAnOrder(ctx context.Context) (context.Context, error) {
    order, err := support.PlaceOrder(cartFromCtx(ctx))
    if err != nil { return ctx, err }
    return context.WithValue(ctx, OrderKey{}, order), nil
}
```

### How Deep Should the Delegation Go?

A step definition should typically be 1–5 lines of code that call
into support modules. If you are writing loops, conditionals, or
direct framework API calls (Selenium selectors, HTTP requests, SQL
queries) inside a step definition, push that logic down.

---

## Survey Existing Steps Before Writing New Ones

Before writing any new step definition, check for existing steps
that already cover the behavior or could be generalized to cover it.
Duplicate and near-duplicate steps are the single largest source of
maintenance debt in BDD projects.

### How to Survey

1. **Scan filenames.** List the files in the relevant keyword
   directory (`given/`, `when/`, `then/`). Because each file is
   named after its step, the directory listing is a searchable
   index of every step in the project.
2. **Search for similar wording.** Look for steps with the same
   verb or domain noun. A step like
   `the user enters their "email"` might already exist as
   `the user enters their "{field}"`.
3. **Check for generalization opportunities.** If an existing step
   does the same thing but for a specific case, consider adding a
   parameter to make it general rather than writing a second step.
   For example, if `a_registered_user.py` exists and you need a
   step for an admin user, check whether the existing step can take
   a role parameter instead of creating `an_admin_user.py`.
4. **Run the audit script.** `scripts/audit.py` detects
   near-duplicate filenames and flags them as consolidation
   candidates.

### When to Modify vs. Create

- **Modify an existing step** when the new scenario needs the same
  behavior with different data. Add a parameter to the existing
  step and rename the file to reflect the generalized pattern.
- **Create a new step** when the behavior is genuinely different,
  not just the data. "the user uploads a photo" and "the user
  enters their name" are different behaviors — keep them separate.

---

## Parameterize Similar Steps

The single most impactful practice for step definition
maintainability. When multiple steps differ only by a noun, value,
or label, consolidate them into one parameterized step definition.

### Why It Matters

Every distinct step definition is code that must be maintained,
tested, and kept consistent. Three steps that do the same thing
with different nouns means three places to update when the
underlying behavior changes. One parameterized step means one.

### Before and After

**Before — three near-identical step definitions (Python/Behave):**

```python
@given('the user enters their email')
def step_enter_email(context):
    context.form.fill_field("email", "test@example.com")

@given('the user enters their phone number')
def step_enter_phone(context):
    context.form.fill_field("phone", "555-0100")

@given('the user enters their mailing address')
def step_enter_address(context):
    context.form.fill_field("address", "123 Main St")
```

**After — one parameterized step definition:**

```python
@given('the user enters their "{field}"')
def step_enter_field(context, field):
    defaults = {
        "email": "test@example.com",
        "phone number": "555-0100",
        "mailing address": "123 Main St",
    }
    context.form.fill_field(field, defaults.get(field, "test-value"))
```

**Before — three near-identical step definitions
(Java/Cucumber):**

```java
@Given("the order status is pending")
public void orderStatusPending() {
    order.setStatus(Status.PENDING);
}

@Given("the order status is shipped")
public void orderStatusShipped() {
    order.setStatus(Status.SHIPPED);
}

@Given("the order status is delivered")
public void orderStatusDelivered() {
    order.setStatus(Status.DELIVERED);
}
```

**After — one parameterized step definition:**

```java
@Given("the order status is {word}")
public void orderStatusIs(String status) {
    order.setStatus(Status.valueOf(status.toUpperCase()));
}
```

**Before — three near-identical step definitions (Go/Godog):**

```go
func theOrderStatusIsPending(ctx context.Context) (context.Context, error) {
    return setOrderStatus(ctx, "pending")
}

func theOrderStatusIsShipped(ctx context.Context) (context.Context, error) {
    return setOrderStatus(ctx, "shipped")
}

func theOrderStatusIsDelivered(ctx context.Context) (context.Context, error) {
    return setOrderStatus(ctx, "delivered")
}
```

**After — one parameterized step definition:**

```go
func theOrderStatusIs(ctx context.Context, status string) (context.Context, error) {
    order := orderFromContext(ctx)
    order.Status = strings.ToUpper(status)
    return ctx, nil
}

// Registered as: ctx.Given(`^the order status is (\w+)$`, theOrderStatusIs)
```

### When NOT to Parameterize

Keep steps separate when the *behavior* differs, not just the
data:

```python
# These look similar but do fundamentally different things — keep separate
@when('the user uploads a profile photo')
def step_upload_photo(context):
    context.uploader.upload_image(context.test_image)
    context.uploader.crop_to_square()

@when('the user enters their "{field}"')
def step_enter_field(context, field):
    context.form.fill_field(field, context.test_data[field])
```

### Recognizing Parameterization Opportunities

Look for these signals:

- Multiple step definitions with the same verb and structure
- Steps that differ only in a quoted value or a trailing noun
- Copy-pasted step bodies with one or two values changed
- A step file where many definitions call the same helper with
  different arguments

---

## Step Reuse Across Features

In most BDD frameworks, step definitions are globally scoped — a
step defined in one file is available to scenarios in any
`.feature` file. Write steps to take advantage of this.

### Guidelines

- **Use domain language, not feature-specific language.** A step
  like `Given a registered user` is reusable. A step like
  `Given the user from the login test` is not.
- **Avoid hard-coded test data in step text.** Pass values as
  parameters instead of embedding them in the step pattern.
- **Keep Given steps composable.** Small, focused Given steps can
  be combined in different scenarios. One large Given that sets up
  an entire test fixture is hard to reuse.

### Example: Composable vs. Monolithic

```gherkin
# Reusable — each step can be mixed into other scenarios
Given a registered user with a "premium" subscription
And the user has 3 items in their cart
And the store is running a "20% off" promotion

# Not reusable — tightly coupled to one scenario
Given the premium user checkout test is set up
```

---

## Parameter Types

### Strings

The most common parameter type. Use quotes in the step text to
make parameters visually distinct.

```gherkin
When the user searches for "wireless headphones"
Then the page title should be "Search Results"
```

### Integers and Floats

Use for counts, amounts, thresholds.

```gherkin
Given the cart contains 3 items
Then the total should be 49.99
```

### Custom Parameter Types

Most frameworks support defining custom parameter types that
convert step text into domain objects. Use them to keep step
definitions clean and catch invalid values early.

**Cucumber (Java) example:**

```java
@ParameterType("pending|shipped|delivered|cancelled")
public OrderStatus orderStatus(String value) {
    return OrderStatus.valueOf(value.toUpperCase());
}

@Given("the order status is {orderStatus}")
public void orderHasStatus(OrderStatus status) {
    testOrder.setStatus(status);
}
```

**Behave (Python) — use `register_type`:**

```python
from behave import register_type
import parse

@parse.with_pattern(r"pending|shipped|delivered|cancelled")
def parse_order_status(text):
    return OrderStatus[text.upper()]

register_type(OrderStatus=parse_order_status)

@given('the order status is {status:OrderStatus}')
def step_order_status(context, status):
    context.order.status = status
```

### Data Tables

Use when a step needs structured input — a list of items, a set
of properties, or multiple entities.

```gherkin
Given the following products exist:
  | name         | price | category    |
  | Headphones   | 79.99 | Electronics |
  | Running Shoe | 129.99| Footwear    |
```

The step definition receives the table as a framework-specific
object. Convert it to domain objects in the step and pass them to
the support layer — do not iterate over table rows to drive UI
interactions directly.

### Doc Strings

Use for multi-line text — error messages, JSON payloads, email
content.

```gherkin
Then the API response should be:
  """json
  {
    "status": "created",
    "id": 42
  }
  """
```

---

## Hooks

Hooks run automatically before or after scenarios, features, or
individual steps. They handle infrastructure concerns that should
not appear in the scenario narrative.

### When to Use Hooks

- **Browser or driver setup/teardown** — open before each
  scenario, close after.
- **Database transactions** — begin before, rollback after, so
  each scenario runs in isolation.
- **Screenshot on failure** — capture the screen when a scenario
  fails.
- **Logging** — record scenario start/end for debugging.
- **Tagging-based setup** — use tags to conditionally run hooks
  (e.g., `@requires-admin` triggers admin user creation).

### When NOT to Use Hooks

- **Scenario-specific setup** that the reader needs to see. If
  the precondition matters for understanding the scenario, it
  belongs in a `Given`, not hidden in a hook.
- **Assertions.** Hooks should not verify outcomes — that is what
  `Then` steps are for.
- **Complex conditional logic.** If a hook has many branches based
  on tags or scenario names, the logic probably belongs in step
  definitions or the support layer.

### Hook Example (Python/Behave)

```python
# environment.py
def before_scenario(context, scenario):
    context.db = Database.connect()
    context.db.begin_transaction()

def after_scenario(context, scenario):
    context.db.rollback()
    context.db.close()
```

### Hook Example (JS/Cucumber)

```javascript
const { Before, After } = require('@cucumber/cucumber');

Before(async function () {
  this.browser = await puppeteer.launch();
  this.page = await this.browser.newPage();
});

After(async function (scenario) {
  if (scenario.result.status === 'FAILED') {
    await this.page.screenshot({ path: `screenshots/${scenario.pickle.name}.png` });
  }
  await this.browser.close();
});
```

### Hook Example (Go/Godog)

```go
func InitializeScenario(ctx *godog.ScenarioContext) {
    ctx.Before(func(ctx context.Context, sc *godog.Scenario) (context.Context, error) {
        db := support.ConnectDB()
        db.BeginTransaction()
        return context.WithValue(ctx, support.DBKey{}, db), nil
    })

    ctx.After(func(ctx context.Context, sc *godog.Scenario, err error) (context.Context, error) {
        db := ctx.Value(support.DBKey{}).(*support.DB)
        db.Rollback()
        db.Close()
        return ctx, nil
    })

    // Step registrations...
}
```

---

## Naming Conventions

Step definitions are identified by their pattern (regex or
expression), but the function/method name still matters for code
readability and debugging.

### Guidelines

- Name the function after the behavior it implements, not the
  step text verbatim.
- Use a consistent prefix: `step_`, or the Given/When/Then
  keyword.
- Keep names short — the step pattern is the documentation.

```python
# Good function names
@given('a registered user with a "{role}" role')
def step_user_with_role(context, role): ...

@when('the user submits the form')
def step_submit_form(context): ...

@then('the confirmation email should be sent')
def step_verify_confirmation_email(context): ...
```

---

## Stub Steps (Pending Implementation)

When creating step files for steps that are not yet implemented —
for example, to satisfy the audit script or to scaffold a new
feature — always mark them as pending using the framework's
built-in mechanism. Never write a stub that silently passes
(e.g., an empty function body or `assert True`), because it hides
missing implementation and lets scenarios pass without actually
testing anything.

### Framework Pending Markers

| Framework | Pending Marker |
| :--- | :--- |
| **Behave** (Python) | Raise `NotImplementedError` — Behave does not have a built-in pending status, so raising this error clearly signals the step needs implementation and fails the scenario. |
| **Cucumber** (Java) | `throw new io.cucumber.java.PendingException()` |
| **Cucumber** (JS/TS) | `return 'pending'` |
| **Cucumber** (Ruby) | `pending` (built-in method) |
| **SpecFlow** (C#) | `ScenarioContext.Current.Pending()` |
| **Godog** (Go) | `return godog.ErrPending` |
| **pytest-bdd** (Python) | `pytest.skip("Not yet implemented")` |

### Examples

```python
# features/steps/when/the_customer_checks_out.py (Behave)
from behave import when

@when('the customer checks out')
def step_impl(context):
    raise NotImplementedError("Step not yet implemented")
```

```java
// Cucumber (Java)
@When("the customer checks out")
public void theCustomerChecksOut() {
    throw new io.cucumber.java.PendingException();
}
```

```javascript
// Cucumber (JS)
When('the customer checks out', function () {
  return 'pending';
});
```

```go
// Godog (Go)
func theCustomerChecksOut(ctx context.Context) error {
    return godog.ErrPending
}
```

These markers cause the scenario to fail or be reported as
pending, making it obvious in test output that implementation is
needed. They are easy to find with a simple search across the
codebase.

---

## Support Layer Patterns

The support layer holds the implementation logic that step
definitions delegate to. This is where framework-specific,
UI-specific, and infrastructure-specific code lives.

### Page Object Pattern (UI Testing)

A page object encapsulates the structure and interactions of a
single page or component. Step definitions call page object
methods; they never touch selectors directly.

```python
# support/pages/login_page.py
class LoginPage:
    def __init__(self, browser):
        self.browser = browser

    def login_as(self, username, password):
        self.browser.fill("#username", username)
        self.browser.fill("#password", password)
        self.browser.click("#login-button")

    def error_message(self):
        return self.browser.text(".login-error")
```

```python
# features/steps/when/the_user_logs_in.py
from behave import when

@when('the user logs in as "{username}" with password "{password}"')
def step_impl(context, username, password):
    context.login_page.login_as(username, password)
```

### API Client Pattern (API Testing)

An API client encapsulates HTTP interactions — base URL, headers,
authentication, serialization.

```python
# support/api_client.py
class APIClient:
    def __init__(self, base_url, token=None):
        self.base_url = base_url
        self.session = requests.Session()
        if token:
            self.session.headers["Authorization"] = f"Bearer {token}"

    def create_product(self, name, price):
        resp = self.session.post(
            f"{self.base_url}/products",
            json={"name": name, "price": price}
        )
        resp.raise_for_status()
        return resp.json()
```

### Factory Pattern (Test Data)

Factories create test entities with sensible defaults, reducing
boilerplate in Given steps.

```python
# support/factories.py
class UserFactory:
    @staticmethod
    def create(name="Test User", role="member", **overrides):
        defaults = {
            "name": name,
            "email": f"{name.lower().replace(' ', '.')}@test.com",
            "role": role,
            "active": True,
        }
        defaults.update(overrides)
        return User.create(**defaults)
```

```python
# features/steps/given/a_registered_user.py
from behave import given
from support.factories import UserFactory

@given('a registered user named "{name}" with a "{role}" role')
def step_impl(context, name, role):
    context.current_user = UserFactory.create(name=name, role=role)
```

---

## Shared State Management

Steps within a scenario need to share state — the user created in
a `Given`, the result captured in a `When`, the value asserted in
a `Then`. Every BDD framework provides a mechanism for this.

In the one-step-per-file model, shared state is especially
important because steps cannot share local variables through a
common file scope. The context/world object is the only path for
inter-step communication.

### The Context/World Object

| Framework | State Object | Scope |
| :--- | :--- | :--- |
| **Behave** | `context` (passed to every step) | Per-scenario by default |
| **pytest-bdd** | Fixtures (via `@pytest.fixture`) | Per-function or wider |
| **Cucumber (Ruby)** | Instance variables (`@var`) in World | Per-scenario |
| **Cucumber (Java)** | Dependency-injected step classes | Per-scenario (with DI) |
| **Cucumber (JS)** | `this` (World object) | Per-scenario |
| **SpecFlow** | `ScenarioContext` / constructor injection | Per-scenario |
| **Godog** (Go) | `context.Context` with typed keys | Per-scenario |

### Guidelines

- **Use the framework's state mechanism.** Do not use module-level
  globals, class-level variables, or file-based state.
- **Name context attributes clearly.** `context.current_user` is
  better than `context.u`. `this.lastApiResponse` is better than
  `this.res`.
- **Set state in Given, read it in When/Then.** If a Then step
  cannot find the expected attribute, the scenario is missing a
  Given — that is a signal, not a bug to work around.
- **Clean up automatically.** Use hooks or framework lifecycle
  management to reset state between scenarios. Never rely on one
  scenario cleaning up after itself for the next one.

### Example: State Flow Across Files

```python
# features/steps/given/a_registered_user.py
from behave import given
from support.factories import UserFactory

@given('a registered user named "{name}"')
def step_impl(context, name):
    context.current_user = UserFactory.create(name=name)
```

```python
# features/steps/when/the_user_places_an_order.py
from behave import when

@when('the user places an order for "{product}"')
def step_impl(context, product):
    context.order = context.order_service.place(
        user=context.current_user,
        product=product
    )
```

```python
# features/steps/then/the_order_should_be_confirmed.py
from behave import then

@then('the order should be confirmed')
def step_impl(context):
    assert context.order.status == "confirmed"
```

Each step reads from and writes to `context`. The chain of state
is explicit and traceable across files.

---

## Scaling Patterns

### Large Projects

When the project has 100+ step definitions:

- **Use the audit script regularly** to detect unused step files
  and near-duplicates.
- **Review new steps** against existing filenames before
  merging — the directory listing serves as a searchable index.
- **Agree on naming conventions.** Inconsistent step phrasing
  leads to duplicates. Maintain a glossary of standard step
  phrases.

### Multi-Team Projects

When multiple teams contribute scenarios and steps:

- **Share common steps via a dedicated package.** Extract shared
  steps into a library that all teams depend on.
- **The keyword directories naturally prevent collisions** since
  each step is in its own file with a descriptive name.

---

## Anti-Patterns

### Near-Duplicate Steps

**Problem:** Multiple step definitions with nearly identical
patterns and bodies, differing only by a noun, value, or minor
wording. Each duplicate adds maintenance cost and increases the
chance of inconsistency when one is updated and the others are
not.

#### How to Spot It

- Two or more step definitions whose patterns share the same
  structure
- Step bodies that are copy-pasted with one or two values changed
- A step file where several definitions call the same method with
  different hard-coded arguments

#### Before

```python
@then('the success notification should be displayed')
def step_success_notification(context):
    assert context.page.notification_visible("success")

@then('the error notification should be displayed')
def step_error_notification(context):
    assert context.page.notification_visible("error")

@then('the warning notification should be displayed')
def step_warning_notification(context):
    assert context.page.notification_visible("warning")
```

#### After

```python
@then('the {notification_type} notification should be displayed')
def step_notification_displayed(context, notification_type):
    assert context.page.notification_visible(notification_type)
```

One definition replaces three. Adding "info" notifications in the
future requires zero step definition changes.

### Multiple Steps Per File

**Problem:** A file containing more than one step definition.
Even a small multi-step file obscures which steps exist and makes
it harder to detect unused code. With one step per file, an unused
step is an unused file — immediately visible in a directory
listing or audit.

#### How to Spot It

- Any step file with more than one `@given`, `@when`, or `@then`
  decorator
- Step files named after a domain rather than a step
  (e.g., `authentication_steps.py` instead of
  `the_user_logs_in.py`)

#### Before

```text
steps/
  all_steps.py        ← 200+ step definitions covering everything
```

#### After

```text
features/steps/
  given/
    a_registered_user.py
    the_shopping_cart_is_empty.py
  when/
    the_user_logs_in.py
    the_customer_adds_to_the_cart.py
  then/
    the_dashboard_should_appear.py
    the_cart_total_should_be.py
```

Each file contains exactly one step. Finding a step means scanning
filenames. Adding a step means adding a file. Removing a step
means deleting a file.

### Implementation Leakage

**Problem:** Step definitions contain raw implementation
details — CSS selectors, SQL queries, HTTP calls, XPath
expressions — instead of delegating to a support layer. This
couples every step to the current implementation and breaks steps
whenever the UI, API, or database changes.

#### How to Spot It

- Selenium/Playwright selectors in step bodies
- Raw SQL or ORM queries in step bodies
- Direct HTTP request construction (`fetch`, `requests.post`,
  etc.)
- Framework-specific API calls (Spring beans, Rails models)

#### Before (JS/Cucumber)

```javascript
Given('a product named {string} exists', async function (name) {
  await this.page.goto('/admin/products/new');
  await this.page.fill('#product-name', name);
  await this.page.fill('#product-price', '9.99');
  await this.page.selectOption('#product-category', 'General');
  await this.page.click('button[type="submit"]');
  await this.page.waitForSelector('.flash-success');
});
```

#### After

```javascript
Given('a product named {string} exists', async function (name) {
  await this.productHelper.createProduct({ name, price: 9.99 });
});
```

The helper handles the mechanics. If product creation moves from
a UI form to an API call, only the helper changes.

### Overloaded Steps

**Problem:** A single step definition does too much — it sets up
state, performs an action, and asserts an outcome, all in one.
This makes steps unreusable and violates the Given/When/Then
separation.

#### How to Spot It

- A `Given` step that also clicks buttons or submits forms
- A `When` step that also contains assertions
- A step body longer than ~10 lines
- A step that calls both setup methods and assertion methods

#### Before

```python
@when('the user logs in and sees the dashboard')
def step_login_and_dashboard(context):
    context.login_page.enter_credentials("alice", "password")
    context.login_page.submit()
    assert context.dashboard.is_displayed()
    assert context.dashboard.welcome_message() == "Welcome, Alice"
```

#### After

```python
@when('the user logs in with valid credentials')
def step_login(context):
    context.login_page.login_as("alice", "password")

@then('the dashboard should be displayed')
def step_dashboard_displayed(context):
    assert context.dashboard.is_displayed()

@then('the welcome message should greet the user')
def step_welcome_message(context):
    assert "Welcome" in context.dashboard.welcome_message()
```

Each step has one job. The login step is now reusable in any
scenario that needs authentication.

### Tight Coupling Between Steps

**Problem:** Steps depend on other steps having run first, sharing
state through implicit side effects rather than through the
framework's context or world object. This creates hidden
dependencies and makes steps fail when reordered or used in new
scenarios.

#### How to Spot It

- Steps that read module-level variables set by other steps
- Steps that assume a previous step set up specific page state or
  navigation
- Steps that break when moved to a different scenario
- A step comment saying "must run after step X"

#### Before

```python
# Module-level variable shared between steps — fragile
_last_created_order = None

@when('the customer places an order')
def step_place_order(context):
    global _last_created_order
    _last_created_order = context.checkout.place_order()

@then('the order confirmation should be sent')
def step_order_confirmation(context):
    # Depends on _last_created_order being set by the previous step
    assert context.email.was_sent_for(_last_created_order.id)
```

#### After

```python
@when('the customer places an order')
def step_place_order(context):
    context.current_order = context.checkout.place_order()

@then('the order confirmation should be sent')
def step_order_confirmation(context):
    assert context.email.was_sent_for(context.current_order.id)
```

The context/world object is the framework's designated way to
share state between steps. Module-level globals bypass this and
create hidden coupling.

In Go/Godog, the same anti-pattern appears as package-level
variables instead of using `context.Context`:

```go
// Bad — package-level variable
var lastOrder *Order

func theCustomerPlacesAnOrder(ctx context.Context) error {
    lastOrder = placeOrder(cartFromCtx(ctx))
    return nil
}

// Good — context threading
func theCustomerPlacesAnOrder(ctx context.Context) (context.Context, error) {
    order := placeOrder(cartFromCtx(ctx))
    return context.WithValue(ctx, OrderKey{}, order), nil
}
```

### Regex Overengineering

**Problem:** Step patterns use complex regular expressions when
simpler alternatives (Cucumber Expressions, parse patterns) would
do the same job more readably. Overly complex regex patterns are
hard to understand, error-prone, and hostile to contributors.

#### How to Spot It

- Regexes with multiple lookaheads, lookbehinds, or nested groups
- Patterns that try to match many different phrasings in a single
  regex
- Developers unable to tell what step text a pattern matches

#### Before

```ruby
Given(/^(?:the |a )?(?:registered |existing )?user (?:named |called )?["']?(\w+)["']?(?: exists)?$/i) do |name|
  create_user(name)
end
```

#### After

```ruby
Given('a registered user named {string}') do |name|
  create_user(name)
end
```

If you need to support multiple phrasings, write multiple simple
step definitions that call the same helper — or standardize on
one phrasing across your feature files. Readable step patterns are
more valuable than flexible ones.

### Assertion-Free Then Steps

**Problem:** A `Then` step performs actions or sets state but never
asserts anything. This means the scenario can pass even when the
expected behavior does not occur.

#### How to Spot It

- `Then` steps with no assertion or expectation calls
- `Then` steps that only log, print, or navigate
- Scenarios that never fail (always green regardless of behavior)

#### Before

```python
@then('the report should be generated')
def step_report_generated(context):
    context.reports_page.open()
    context.reports_page.click_latest()
    # No assertion — this step always passes
```

#### After

```python
@then('the report should be generated')
def step_report_generated(context):
    report = context.reports.latest()
    assert report is not None, "Expected a report to be generated"
    assert report.status == "complete"
```

### Silent Stub Steps

**Problem:** Step definition files are created as placeholders but
contain empty bodies or trivially-passing logic (`pass`,
`assert True`, `return`). These stubs satisfy the audit script
and compile without errors, but they let scenarios pass without
testing anything — hiding the fact that implementation is missing.

#### How to Spot It

- Step bodies that are empty or contain only `pass`
- `Then` steps with `assert True` or no assertion at all
- Steps whose body is a comment like `# TODO: implement`
- Scenarios that pass unexpectedly early in development

#### Before

```python
@when('the customer checks out')
def step_impl(context):
    pass  # Scenario passes silently — checkout is never tested
```

```javascript
When('the customer checks out', function () {
  // nothing here — scenario passes
});
```

#### After

```python
@when('the customer checks out')
def step_impl(context):
    raise NotImplementedError("Step not yet implemented")
```

```javascript
When('the customer checks out', function () {
  return 'pending';
});
```

```go
func theCustomerChecksOut(ctx context.Context) error {
    return godog.ErrPending
}
```

Every framework has a pending/not-implemented marker that causes
the scenario to fail or be flagged. Use it. See the
[Stub Steps](#stub-steps-pending-implementation) section for
the full list of markers by framework.

### Hard-Coded Test Data

**Problem:** Step patterns embed specific test data values, making
the step usable only for that exact case.

#### How to Spot It

- Step patterns that mention specific names, IDs, or values
- Steps that work for one scenario but cannot be reused with
  different data

#### Before

```java
@Given("Alice has a premium account")
public void aliceHasPremiumAccount() {
    createUser("Alice", AccountType.PREMIUM);
}

@Given("Bob has a basic account")
public void bobHasBasicAccount() {
    createUser("Bob", AccountType.BASIC);
}
```

#### After

```java
@Given("{string} has a {word} account")
public void userHasAccount(String name, String accountType) {
    createUser(name, AccountType.valueOf(accountType.toUpperCase()));
}
```

---

## Quality Checklist

Use this checklist when reviewing step definitions:

1. **One step per file** — Each file contains exactly one step
   definition, named after the step in snake_case, placed in the
   correct keyword directory (`given/`, `when/`, `then/`).
2. **No near-duplicates** — Every parameterization opportunity
   has been taken.
3. **Thin step bodies** — Steps delegate to support modules; no
   raw selectors, queries, or API calls.
4. **Correct responsibility** — Given = state, When = action,
   Then = assertion. No mixing.
5. **No hidden coupling** — State passes through context/world,
   not globals or side effects.
6. **Readable patterns** — Simple expressions preferred over
   complex regex.
7. **Assertions present** — Every Then step asserts something.
8. **No hard-coded data** — Parameters used for variable values.
9. **No silent stubs** — Placeholder steps use the framework's
   pending marker, not empty bodies or `assert True`.
10. **All step files used** — The audit script reports no unused
    step files and no missing step definitions.
11. **Hooks for infrastructure only** — Scenario-visible setup
    uses Givens, not hooks.
12. **Appropriate parameter types** — Strings, integers, and
    custom types used instead of raw regex capture groups where
    avoidable.
