# EARS Requirements — Comprehensive Reference

## The General EARS Syntax

Every EARS requirement follows a single generalized structure:

```text
While <optional precondition(s)>, when <optional trigger>,
the <system name> shall <system response>.
```

Cardinality rules:

| Component | Cardinality | Description |
| :--- | :--- | :--- |
| Precondition(s) | Zero or many | States that must be true (`While` clause) |
| Trigger | Zero or one | Event that initiates the response (`When` clause) |
| System name | Exactly one | The system, subsystem, or component |
| System response | One or many | What the system shall do |

Clauses always appear in temporal order: preconditions → trigger →
system → response. This ordering reflects logical precedence: a
state must hold, then an event occurs within that state, then the
system responds.

---

## Pattern 1: Ubiquitous

**Template:** `The <system name> shall <system response>.`

Requirements that state fundamental, always-active system
properties. No preconditions, triggers, or conditions —
unconditionally true at all times. No EARS keywords are used.

**When to use:** For properties, constraints, or behaviors that
hold continuously regardless of system state.

**Examples:**

```text
The mobile phone shall have a mass of less than 200 grams.
The system shall encrypt all data at rest using AES-256.
The API shall return responses in JSON format.
The system shall comply with WCAG 2.1 Level AA accessibility
guidelines.
The system shall use TLS 1.3 or later for all network
communications.
The password storage module shall hash all passwords using bcrypt
with a minimum cost factor of 12.
The database shall maintain referential integrity across all
foreign key relationships.
```

---

## Pattern 2: Event-Driven

**Template:**
`When <trigger>, the <system name> shall <system response>.`

**Keyword:** `When`

The system performs an action when a discrete event occurs. The
trigger is instantaneous — it happens at a point in time.

**When to use:** For behaviors triggered by a user action, a
signal, a threshold crossing, a message arriving, or a timer
expiring.

**Examples:**

```text
When 'mute' is selected, the laptop shall suppress all audio
output.
When the user clicks the "Submit Order" button, the e-commerce
system shall create an order record and redirect to the order
confirmation page within 2 seconds.
When a new user account is created, the system shall send a
verification email to the registered address within 30 seconds.
When the temperature sensor detects a reading above 80 degrees
Celsius, the cooling fan shall activate.
When the user selects "Export to PDF," the reporting system shall
generate a PDF document containing all visible data within
10 seconds.
```

---

## Pattern 3: State-Driven

**Template:**
`While <precondition(s)>, the <system name> shall <system response>.`

**Keyword:** `While`

Requirements active for the entire duration of a state. The
precondition describes a persistent condition, not a momentary
event.

**When to use:** For behaviors that must be continuously active
during a particular system state, operational mode, or
environmental condition.

**Distinguishing from Event-Driven:** If you can ask "how long
does it last?", it's a state — use `While`. If it's
instantaneous, use `When`.

**Examples:**

```text
While there is no card in the ATM, the ATM shall display 'insert
card to begin'.
While the system is in maintenance mode, the system shall reject
new user logins.
While battery level is below 15 percent, the mobile device shall
disable background application refresh.
While the user session is active, the web application shall
refresh the authentication token every 15 minutes.
While the patient monitor is connected to a patient, the monitor
shall sample vital signs at least once per second.
```

---

## Pattern 4: Unwanted Behavior

**Template:**
`If <unwanted condition>, then the <system name> shall <response>.`

**Keywords:** `If ... then`

System responses to undesirable situations — errors, failures,
faults, or boundary violations. The `If ... then` keywords signal
that the condition is *undesirable*, distinguishing this from
normal Event-Driven triggers.

**When to use:** For error handling, fault tolerance, safety
responses, boundary conditions, and recovery from undesirable
states.

**Distinguishing from Event-Driven:** `If/Then` is exclusively
for **unwanted** conditions. Normal operational triggers use
`When`. A user clicking "Submit" is `When`; an invalid credit
card is `If/Then`.

**Examples:**

```text
If an invalid credit card number is entered, then the website
shall display 'please re-enter credit card details'.
If the password is entered incorrectly three times, then the
application shall lock the user account for 30 minutes.
If the database is unavailable, then the system shall queue
incoming requests and retry every 30 seconds.
If the API rate limit is exceeded, then the system shall return
a 429 status code with a Retry-After header.
If the primary server fails to respond within 5 seconds, then
the load balancer shall route traffic to the secondary server.
```

---

## Pattern 5: Optional Feature

**Template:**
`Where <feature>, the <system name> shall <system response>.`

**Keyword:** `Where`

Requirements that apply only when a particular feature or
configuration option is present. Used for product lines, optional
modules, or configurable systems.

**When to use:** For requirements conditional on a feature,
module, or configuration option being present in a particular
product variant.

**Examples:**

```text
Where the car has a sunroof, the car shall have a sunroof
control panel on the driver door.
Where two-factor authentication is enabled, the system shall
prompt for a verification code after password entry.
Where the enterprise license tier is active, the system shall
enable SAML-based single sign-on integration.
Where the application includes an offline mode, the system shall
cache the most recent 7 days of data for offline access.
Where the printer has a duplex unit, the printer shall default
to double-sided printing.
```

---

## Pattern 6: Complex (Combined Patterns)

Complex requirements combine multiple EARS keywords. The canonical
clause order is: `Where` → `While` → `When` → `If/Then` → `shall`.

### While + When (State + Event)

```text
While <precondition(s)>, when <trigger>,
the <system name> shall <system response>.
```

**Examples:**

```text
While the aircraft is on ground, when reverse thrust is
commanded, the engine control system shall enable reverse thrust.
While the user is logged in, when the session has been idle for
15 minutes, the application shall display a timeout warning.
While the system is in debug mode, when an unhandled exception
occurs, the logging service shall capture the full stack trace.
```

### Where + When (Feature + Event)

```text
Where <feature is included>, when <trigger>,
the <system name> shall <system response>.
```

**Examples:**

```text
Where voice control is enabled, when the user says "navigate
home," the navigation system shall calculate a route to the
saved home address.
Where biometric authentication is available, when the user taps
the login button, the system shall prompt for fingerprint
verification.
```

### Where + While (Feature + State)

```text
Where <feature is included>, while <precondition(s)>,
the <system name> shall <system response>.
```

**Examples:**

```text
Where the heated seats option is installed, while the cabin
temperature is below 10 degrees Celsius, the seat heater shall
activate automatically.
Where the premium analytics module is licensed, while a report
is being generated, the system shall display a progress
indicator.
```

### While + If/Then (State + Unwanted Behavior)

```text
While <precondition(s)>, if <unwanted condition>,
then the <system name> shall <system response>.
```

**Examples:**

```text
While the aircraft is in flight, if engine oil pressure drops
below 40 PSI, then the engine monitoring system shall illuminate
the warning light.
While the system is processing a batch job, if memory usage
exceeds 85 percent, then the batch processor shall pause
execution and release cached resources.
```

### When + If/Then (Event + Unwanted Behavior)

```text
When <trigger>, if <unwanted condition>,
then the <system name> shall <system response>.
```

**Examples:**

```text
When the user submits an order, if payment validation fails,
then the system shall notify the customer and discard the
incomplete order.
When reverse gear is selected, if the gear does not engage
within 2 seconds, then the transmission controller shall display
a gear fault notification.
```

### Where + While + When (Feature + State + Event)

```text
Where <feature is included>, while <precondition(s)>,
when <trigger>, the <system name> shall <system response>.
```

**Examples:**

```text
Where adaptive cruise control is installed, while the vehicle
is traveling above 30 km/h, when the lead vehicle decelerates,
the ACC system shall reduce speed to maintain a 2-second
following gap.
Where the premium analytics module is licensed, while a report
is being generated, when the dataset exceeds 1 million rows,
the system shall switch to the distributed processing engine.
```

### Guidelines for Complex Requirements

- Combine patterns only when the requirement genuinely involves
  multiple conditions.
- If a complex requirement becomes difficult to read, decompose
  it into simpler requirements.
- Maintain the canonical clause order:
  Where → While → When → If/Then → shall.
- Each complex requirement should still describe a single,
  coherent behavior.
- Limit preconditions to three or fewer. Beyond three, use a
  table, decision matrix, or decompose into multiple
  requirements.

---

## Pattern Selection Decision Tree

```text
Is the requirement always active (no conditions)?
  YES → Ubiquitous: "The <system> shall <response>"
  NO  → Does it respond to a specific event?
          YES → Is there also a state precondition?
                  YES → Complex: "While <state>, when <event>,
                         the <system> shall <response>"
                  NO  → Event-Driven: "When <event>,
                         the <system> shall <response>"
          NO  → Is it active during a persistent state?
                  YES → State-Driven: "While <state>,
                         the <system> shall <response>"
                  NO  → Does it handle an error or fault?
                          YES → Unwanted: "If <condition>,
                                 then the <system> shall
                                 <response>"
                          NO  → Is it feature-dependent?
                                  YES → Optional:
                                         "Where <feature>,
                                         the <system> shall
                                         <response>"
                                  NO  → Reconsider: likely
                                         Ubiquitous or needs
                                         decomposition
```

---

## EARS Keywords and Obligation Levels

### Structural Keywords

| Keyword | Pattern | Meaning |
| :--- | :--- | :--- |
| `While` | State-Driven | Persistent precondition/state |
| `When` | Event-Driven | Discrete triggering event |
| `Where` | Optional Feature | Feature/configuration condition |
| `If ... then` | Unwanted Behavior | Undesirable condition and recovery |
| `shall` | All patterns | Mandatory obligation |

### Obligation Keywords

| Keyword | Level | Use in EARS |
| :--- | :--- | :--- |
| **shall** | Mandatory | Required. The standard EARS keyword. |
| **should** | Advisory | Do not use — creates ambiguity. |
| **may** | Permissive | Do not use in requirements. |
| **will** | Intent | Do not use — confused with "shall". |

Always use "shall" for requirements. It signals a testable,
mandatory obligation.

---

## Decomposing Complex Requirements

When faced with a multi-part requirement from the user, decompose
it into atomic EARS requirements.

### Strategy

1. **Separate normal behavior from error handling.** Normal flows
   use Event-Driven (`When`). Error flows use Unwanted Behavior
   (`If/Then`).
2. **Separate distinct triggers.** Different events producing
   different responses become separate requirements.
3. **Separate distinct states.** Behavior that differs across
   states gets one State-Driven requirement per state.
4. **Separate optional features.** Feature-dependent behavior gets
   extracted into `Where`-based requirements.

### Example: Login System

**User says:** "The system should make user login convenient and
provide error prompts."

**Decomposed EARS requirements:**

```text
When the user enters a username and password and clicks the
"Login" button, the authentication system shall verify the
credentials within 2 seconds.

When credential verification succeeds, the authentication system
shall create a session token and redirect the user to the
dashboard.

If credential verification fails, then the authentication system
shall display "Username or password incorrect."

If the user enters incorrect credentials three consecutive times,
then the authentication system shall lock the account for
30 minutes.
```

### Example: Permission Management

**User says:** "Only admins should be able to delete things."

**Decomposed EARS requirements:**

```text
When a user with the "admin" role selects "delete post," the
content management system shall delete the specified post and
display a confirmation.

If a user without the "admin" role attempts to delete a post,
then the content management system shall display "Insufficient
permissions" and prevent the deletion.
```

---

## EARS-to-Gherkin Structural Mapping

Each EARS element maps naturally to Gherkin:

| EARS Element | Gherkin Keyword | Purpose |
| :--- | :--- | :--- |
| `While <precondition>` | `Given <state>` | Establishes context |
| `When <trigger>` | `When <action>` | The triggering event |
| `the <system> shall <response>` | `Then <outcome>` | Expected result |
| `Where <feature>` | `Given <feature enabled>` or `Background` | Feature presence |
| `If <unwanted condition>` | `Given <error setup>` or `When <error>` | Unwanted situation |

**EARS** is the requirement (what must be true). **Gherkin**
scenarios are the proof (concrete examples demonstrating it is
true).

---

## NFR Patterns

Non-functional requirements follow the same EARS patterns. Common
shapes:

**Performance** (typically Event-Driven with measurable response
time):

```text
When the user submits a search query, the search service shall
return results within 200 milliseconds.
```

**Availability** (typically Ubiquitous):

```text
The system shall maintain a minimum uptime of 99.99 percent
measured monthly.
```

**Security** (typically Ubiquitous or Unwanted Behavior):

```text
The system shall encrypt all data at rest using AES-256.

If authentication fails five consecutive times from the same IP
address, then the system shall block that IP for 1 hour.
```

**Accessibility** (typically Ubiquitous):

```text
The system shall comply with WCAG 2.1 Level AA accessibility
guidelines.
```

**Scalability** (typically Ubiquitous with measurable limits):

```text
The system shall support a minimum of 10,000 concurrent user
sessions without degradation below the defined performance
thresholds.
```

---

## Domain-Specific Examples

### Web Applications and APIs

```text
The REST API shall require authentication via OAuth 2.0 bearer
tokens for all endpoints except /health and /docs.

When the user clicks the "Submit Order" button, the e-commerce
system shall create an order record and redirect to the order
confirmation page within 2 seconds.

While the application is offline, the system shall store task
updates in local storage.

If the API rate limit is exceeded, then the system shall return
a 429 status code with a Retry-After header.

Where the enterprise license tier is active, the system shall
enable SAML-based single sign-on integration.

While the user is authenticated, when the user requests access
to a resource, if the user's role does not include the required
permission, then the system shall return a 403 Forbidden
response and log the access attempt.
```

### Embedded Systems and IoT

```text
The firmware shall use a watchdog timer with a maximum timeout
of 2 seconds.

When the temperature sensor detects a reading above 80 degrees
Celsius, the cooling fan shall activate.

While the device is operating on battery power, the IoT sensor
shall reduce its reporting interval from 1 minute to 5 minutes.

If the watchdog timer expires without being reset, then the
microcontroller shall perform a hardware reset.

Where the device includes a GPS module, the asset tracker shall
report its position every 60 seconds when in motion.
```

### Medical Devices

```text
The infusion pump shall comply with IEC 62304 software lifecycle
requirements.

When the patient's heart rate exceeds 200 bpm, the cardiac
monitor shall trigger an audible alarm within 2 seconds.

While the patient monitor is connected to a patient, the monitor
shall sample vital signs at least once per second.

If the infusion pump detects an air bubble in the tubing, then
the pump shall stop infusion immediately and sound an alarm.

Where Bluetooth connectivity is included, the wearable health
device shall encrypt all transmitted patient data using AES-128
or stronger.
```

### Financial Systems

```text
The payment processing system shall comply with PCI DSS Level 1
requirements.

When a wire transfer request exceeds $10,000, the compliance
system shall flag the transaction for anti-money-laundering
review.

While the market is closed, the trading platform shall accept
orders but mark them as "queued for next trading session."

If the fraud detection system identifies a transaction with a
risk score above 0.85, then the system shall hold the
transaction, notify the account holder via SMS, and require
explicit confirmation before proceeding.
```

---

## Anti-Patterns

### The Eight Defects EARS Prevents

EARS was designed to address these recurring problems in natural
language requirements:

| Defect | Description | Example |
| :--- | :--- | :--- |
| **Ambiguity** | Multiple interpretations possible | "The system shall process the record" |
| **Vagueness** | Imprecise, unmeasurable language | "The system shall respond quickly" |
| **Complexity** | Multiple behaviors in one statement | "The system shall validate, store, and notify..." |
| **Omission** | Missing triggers, conditions, or responses | "The system shall disconnect the network" |
| **Duplication** | Same requirement stated differently in multiple places | Redundant specs across documents |
| **Wordiness** | Excessive verbosity obscuring intent | Multi-paragraph requirement burying the obligation |
| **Inappropriate implementation** | Specifying *how* instead of *what* | "The system shall use a MySQL database" |
| **Untestability** | Cannot be verified through testing | "The system shall be reliable" |

### Anti-Pattern 1: Using the Wrong Pattern

Misclassifying the requirement type causes confusion about system
behavior.

#### When vs. While

`When` is for discrete, instantaneous events. `While` is for
persistent states with duration.

```text
BAD (When for a state):
  When the system is in maintenance mode, the system shall
  reject logins.

GOOD (While for a state):
  While the system is in maintenance mode, the system shall
  reject logins.
```

**Why it matters:** "When" implies a one-time response to entering
maintenance mode. "While" correctly communicates that login
rejection persists for the entire duration of the state.

#### When vs. If/Then

`When` handles normal operational triggers. `If/Then` handles
unwanted conditions.

```text
BAD (If/Then for normal behavior):
  If the user clicks submit, then the system shall save the
  form.

GOOD (When for normal behavior):
  When the user clicks submit, the system shall save the form.
```

```text
BAD (When for an error condition):
  When an invalid credit card is entered, the system shall
  display an error.

GOOD (If/Then for an error condition):
  If an invalid credit card number is entered, then the payment
  system shall display "Invalid card number. Please re-enter
  your card details."
```

**Why it matters:** The `If/Then` pattern signals to readers and
testers that this is a defensive requirement handling an abnormal
case. Using `When` for errors loses this semantic signal.

### Anti-Pattern 2: Compound Requirements (Multiple "shall")

Packing multiple obligations into a single requirement makes
testing, tracing, and maintaining them difficult.

```text
BAD:
  The system shall validate input and log errors and send
  notifications.

GOOD (decomposed into three requirements):
  When the user submits input, the system shall validate all
  fields against the defined schema.

  If input validation fails, then the system shall log the
  validation errors with a timestamp and user ID.

  If a critical validation error occurs, then the system shall
  send a notification to the system administrator.
```

**Rule of thumb:** If a requirement contains "and" between two
actions, consider whether it should be two requirements. Each
EARS statement should describe a single, atomic system response.

### Anti-Pattern 3: Using "Should" Instead of "Shall"

"Should" implies the requirement is optional or advisory, creating
ambiguity about whether the system must actually comply.

```text
BAD:
  The system should encrypt data at rest.

GOOD:
  The system shall encrypt all data at rest using AES-256.
```

**EARS obligation keywords:**

| Word | Meaning | Use in EARS |
| :--- | :--- | :--- |
| shall | Mandatory | Always use this |
| should | Advisory | Never use — ambiguous |
| may | Permissive | Never use in requirements |
| will | Intent | Never use — confused with "shall" |
| must | Mandatory (informal) | Use "shall" for consistency |

### Anti-Pattern 4: Passive Voice

Passive voice obscures which entity is responsible for the action.

```text
BAD:
  Data shall be encrypted by the system.

GOOD:
  The system shall encrypt all data at rest.
```

```text
BAD:
  An error message shall be displayed.

GOOD:
  The authentication system shall display "Invalid email or
  password."
```

**Rule:** Always write in active voice with the system name as
the subject.

### Anti-Pattern 5: Vague Quantifiers and Adjectives

Unmeasurable language makes requirements untestable.

```text
BAD:  The system shall handle many concurrent users.
GOOD: The system shall support a minimum of 10,000 concurrent
      user sessions.

BAD:  The system shall respond quickly.
GOOD: The system shall return search results within
      200 milliseconds.

BAD:  The system shall be user-friendly.
GOOD: The system shall enable a first-time user to complete
      the core workflow without external assistance in under
      5 minutes.

BAD:  The system shall be highly available.
GOOD: The system shall maintain a minimum uptime of 99.99
      percent measured monthly.
```

### Anti-Pattern 6: Missing System Name

Omitting the system name makes it unclear who or what performs the
action.

```text
BAD:
  When the button is clicked, it shall save the data.

GOOD:
  When the user clicks the "Save" button, the document editor
  shall persist the current document to the data store.
```

**Rule:** Always name the system explicitly. Never use pronouns
like "it." Use consistent terminology — if the system is called
"the navigation system" in one requirement, do not call it
"the nav module" elsewhere.

### Anti-Pattern 7: Specifying Implementation

EARS requirements describe *what* the system must achieve, not
*how* it achieves it internally.

```text
BAD:
  When the user logs in, the system shall query the MySQL users
  table and compare the bcrypt hash.

GOOD:
  When the user submits credentials, the authentication system
  shall verify the credentials and return the result within
  500 milliseconds.
```

```text
BAD:
  The system shall use WebSockets for real-time updates.

GOOD:
  The system shall deliver data updates to all connected clients
  within 500 milliseconds of the data change occurring.
```

**Exception:** Some requirements legitimately constrain technology
choices (e.g., compliance or interoperability requirements like
"The system shall use TLS 1.3 or later"). This is acceptable when
the technology choice is itself the requirement, not an
implementation preference.

### Anti-Pattern 8: Negative Requirements

Negative phrasing ("shall not") is harder to test and often
unclear.

```text
BAD:
  The system shall not prevent authorized users from accessing
  resources.

GOOD:
  The system shall allow authenticated users with the required
  role to access protected resources.
```

**Guidelines:**

- Substitute "shall enable" for "shall not prohibit"
- Substitute "shall prohibit" for "shall not allow"
- Never use double negatives
  ("shall not prevent" = "shall allow")
- Some negative requirements are valid and clearer in negative
  form (e.g., safety constraints: "the system shall not exceed
  100 degrees Celsius"). Use judgment.

### Anti-Pattern 9: Too Many Preconditions

When a requirement accumulates more than three preconditions, it
becomes unwieldy and hard to test.

```text
BAD:
  While the system is online, while the user is authenticated,
  while the database is available, while the cache is warm,
  when the user requests data, the system shall return results.

BETTER (decomposed):
  While the user is authenticated, when the user requests data,
  the system shall return results within 200 milliseconds.

  If the database is unavailable, then the system shall return
  cached results and display a staleness indicator.
```

**Rule:** Limit preconditions to three or fewer. Beyond that,
decompose into multiple requirements or use a table/decision
matrix.

### Anti-Pattern 10: Missing Trigger or Condition

A requirement that omits the triggering event or precondition is
incomplete.

```text
BAD:
  The system shall disconnect the network.

GOOD:
  When the disconnect button is pressed, the software shall
  terminate the active network connection.
```

```text
BAD:
  The engine control system shall enable reverse thrust.

GOOD:
  While the aircraft is on ground, when reverse thrust is
  commanded, the engine control system shall enable reverse
  thrust.
```

**Why it matters:** Without the trigger or condition, the
requirement is ambiguous — should the system always disconnect the
network? On startup? On shutdown? EARS forces you to make this
explicit.

### Before-and-After Transformations

These examples show how to transform vague prose into valid EARS
requirements:

#### "The system should be fast"

```text
BAD:  The system should be fast.
GOOD: The system shall return search results within
      200 milliseconds.
      (Ubiquitous or Event-Driven, depending on context)
```

#### "The phone should be lightweight"

```text
BAD:  The phone should be lightweight.
GOOD: The mobile phone shall have a mass of less than 200 grams.
      (Ubiquitous)
```

#### "The system should process orders efficiently and handle failures properly"

```text
BAD:  The system should process orders efficiently and handle
      failures properly.

GOOD (decomposed):
  When a customer submits an order, the order processing system
  shall validate the payment information and store the order
  record within 3 seconds.
  (Event-Driven)

  If payment validation fails, then the order processing system
  shall notify the customer with the reason for failure and
  discard the incomplete order.
  (Unwanted Behavior)
```

#### "Only admins should be able to delete things"

```text
BAD:  Only admins should be able to delete things.

GOOD (decomposed):
  When a user with the administrator role initiates a deletion
  request, the system shall delete the specified resource and
  log the action.
  (Event-Driven)

  If a user without the administrator role attempts a deletion,
  then the system shall reject the request and display
  "Insufficient permissions: administrator role required."
  (Unwanted Behavior)
```

#### "All data shall be encrypted"

```text
BAD:  All data shall be encrypted.

GOOD (decomposed — "all" is ambiguous):
  The system shall encrypt all data at rest using AES-256.
  (Ubiquitous)

  The system shall encrypt all data in transit using TLS 1.3
  or later.
  (Ubiquitous)
```

### Words and Phrases to Eliminate

**Vague adverbs:** quickly, slowly, efficiently, properly,
reasonably, approximately, usually, typically, generally, soon,
eventually, immediately

**Unmeasurable adjectives:** user-friendly, flexible, intuitive,
robust, scalable, efficient, seamless, responsive, reliable,
powerful, smart, easy-to-use

**Vague quantifiers:** various, some, any, many, few, several,
most, a lot, up to (without a number)

**Escape clauses:** as appropriate, if possible, as needed,
where practical, to the extent feasible, if necessary, when
applicable (without specifying when)

**Continuation terms:** etc., and so on, and/or, such as
(without exhaustive list), for example (when used as the
complete specification)

**Indefinite temporal terms:** timely, in a timely manner, in
real time (without defining latency), promptly, without delay,
as soon as possible, periodic (without period)

**Replace each with a specific, measurable value.** If you
cannot define a measurement, the requirement is likely ambiguous
and needs further elicitation.

---

## Elicitation and Validation

### Active Elicitation

Requirements do not pre-exist as fully formed statements — they
must be drawn out through dialogue. When the user describes a
feature or behavior:

1. **Probe the "why."** Understanding the business goal helps
   formulate the right requirement, not just the stated one.
2. **Identify tacit assumptions.** Users often omit things they
   consider obvious. Ask about error cases, edge conditions, and
   non-functional expectations.
3. **Challenge vagueness.** If the user says "fast," "easy," or
   "secure," ask for measurable criteria. What response time?
   What does "easy" mean concretely? What security standard?

### Characteristics of a Well-Formed Requirement

Every EARS requirement should satisfy these nine properties
(derived from ISO/IEC/IEEE 29148):

| Property | Description | Test |
| :--- | :--- | :--- |
| **Necessary** | Essential to the stakeholder's needs | Would removing it cause a deficiency? |
| **Appropriate** | At the right abstraction level | No design details in a high-level spec |
| **Unambiguous** | Only one interpretation possible | Could two readers disagree on meaning? |
| **Complete** | Contains all info needed to understand it | Needs no external explanation |
| **Singular** | Expresses one discrete obligation | Contains exactly one "shall" |
| **Feasible** | Can be realized within constraints | Is it technically achievable? |
| **Verifiable** | Can be proven through testing | Can you write a pass/fail test? |
| **Correct** | Accurately represents stakeholder intent | Does the user agree this is what they meant? |
| **Conforming** | Follows EARS templates | Uses the correct pattern and keywords |

### The Testability Principle

A requirement is only as good as its verifiability. For every
requirement, you should be able to define a **fit criterion** — a
measurement that determines whether the solution meets the
requirement.

**If you cannot define how to test it, the requirement is
ambiguous.**

#### Verification Methods

| Method | Description | When to Use |
| :--- | :--- | :--- |
| **Test** | Instrumented measurement against a threshold | Performance, timing, capacity |
| **Demonstration** | Show the system performs the behavior | Functional behavior, UI |
| **Inspection** | Visual examination of artifacts | Compliance, documentation |
| **Analysis** | Mathematical models or simulations | Safety, reliability |

#### SMART Criteria for NFRs

Non-functional requirements are prone to vagueness. Apply:

- **S**pecific: Names a specific behavior or component
- **M**easurable: Uses metrics
  (e.g., "99.9% uptime" not "high availability")
- **A**ttainable: Verification is technically possible
- **R**elevant: Maps to a business or safety goal
- **T**ime-bound: Specifies when or for how long

### Elicitation Questions by Requirement Type

When the user describes a feature, ask targeted questions to
determine the EARS pattern and fill in the template:

#### For Ubiquitous Requirements

- "Is this always true, regardless of system state?"
- "Are there any conditions where this would NOT apply?"
- "What is the measurable threshold?"

#### For Event-Driven Requirements

- "What specific action or event triggers this behavior?"
- "What exactly should the system do in response?"
- "Is there a time constraint on the response?"
- "What happens if the trigger occurs multiple times rapidly?"

#### For State-Driven Requirements

- "How long does this condition persist?"
- "What causes the system to enter this state?"
- "What causes the system to leave this state?"
- "What should happen when the state ends?"

#### For Unwanted Behavior Requirements

- "What could go wrong?"
- "What should the system do when this error occurs?"
- "How does the system recover to normal operation?"
- "Should the error be logged, and should anyone be notified?"

#### For Optional Feature Requirements

- "Is this always present, or only in certain configurations?"
- "What happens in systems where this feature is NOT included?"
- "How is the feature enabled or disabled?"

#### For Complex Requirements

- "Is this behavior conditional on both a state AND an event?"
- "Are there multiple conditions that must all be true?"
- "Can this be simplified into separate requirements?"

### Decomposition Strategy

When user prose contains multiple behaviors, decompose into
atomic requirements:

1. **Identify the distinct behaviors.** Look for "and," "or,"
   and semicolons separating different obligations.
2. **Separate normal from error paths.** The happy path uses
   Event-Driven (`When`); error handling uses Unwanted Behavior
   (`If/Then`).
3. **Separate distinct triggers.** Different events producing
   different responses become separate requirements.
4. **Separate distinct states.** Behavior that varies by state
   gets one requirement per state.
5. **Extract optional features.** Feature-dependent behavior goes
   into `Where`-based requirements.
6. **Verify independence.** Each decomposed requirement should be
   independently testable.

### Common User Phrases and Their EARS Translations

| User says | Likely pattern | Clarify |
| :--- | :--- | :--- |
| "It should always..." | Ubiquitous | Confirm no conditions apply |
| "When the user clicks..." | Event-Driven | Ask about error cases |
| "During maintenance..." | State-Driven | Ask what defines entry/exit |
| "If something goes wrong..." | Unwanted Behavior | Ask for specific failure modes |
| "For premium users..." | Optional Feature | Ask how feature is enabled |
| "It needs to be fast" | Ubiquitous or Event-Driven | Ask for a number |
| "Handle errors properly" | Unwanted Behavior | Ask for each error case |
| "Make it secure" | Multiple patterns | Ask which threats to address |
| "Only admins can..." | Event-Driven + Unwanted | Decompose into allowed + denied |
| "The system should support..." | Ambiguous | Ask what "support" means concretely |

### Validating Against the User's Intent

After formulating EARS requirements, always present them to the
user for confirmation:

1. **Read back the requirements** in plain language to verify
   they capture the user's intent.
2. **Highlight any assumptions** you made during formulation.
3. **Ask about gaps:** "Are there error conditions I haven't
   covered?" "Are there other states or modes where this behaves
   differently?"
4. **Confirm measurable values** are acceptable: "Is 200ms an
   appropriate response time target?"

The goal is not just syntactic correctness — it's ensuring the
requirement accurately represents what the user actually needs.

---

## Quality Checklist

Before finalizing any EARS requirement, verify:

- [ ] Contains exactly one "shall"
- [ ] System name is explicit (no pronouns)
- [ ] Uses active voice
- [ ] Response is specific and measurable
- [ ] Correct EARS keyword is used (When/While/If-then/Where)
- [ ] No vague adverbs, adjectives, or quantifiers
- [ ] Describes *what*, not *how*
  (unless technology is the requirement)
- [ ] Can a tester write a test case from this requirement alone?
- [ ] Single behavior — would splitting improve clarity?
- [ ] Positive phrasing where possible
