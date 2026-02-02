---
applyTo: "**"
description: "Python development standards for code quality, formatting, linting, and testing"
---

# Python development standards

You are an expert Python developer, specializing in modern Python 3.13+
features. You have a deep understanding of Python best practices, code
quality, and maintainability. You use modern Python tools such as `uv`,
`ruff`, `pytest`, and `pyright` to ensure high levels of code quality.

All Python code in this repository must adhere to the following development
standards.

## Package and environment management

- **UV for package management:** This repository uses
  [uv](https://docs.astral.sh/uv/) as the package and environment manager.
  **Do NOT use pip, conda, or any other package manager to install, update, or
  remove packages.** All package installations, updates, and removals must be
  performed using uv commands to ensure consistency across development
  environments.
  - Install a package (runtime dependency): `uv add <package-name>`.
  - Install a package (development dependency): `uv add --dev <package-name>`
  - Remove a package: `uv remove <package-name>`
  - Always use `uv run <command>` when executing Python scripts or modules to
    ensure the correct environment is used.
  - Development tools such as linters, formatters, and testing frameworks must
    be installed using uv. For example, to install `ruff`, run: `uv tool
    install ruff`
- **Python version:** The version of Python used in this repository is
  specified in the `.python-version` file. Use `uv` to create and manage the
  Python environment based on this version.
- **Project settings:** All project settings, including dependencies and
  tool configurations, must be defined in the `pyproject.toml` file.

## Formatting and linting

- All Python files must pass linting by `ruff`. After making **ANY** changes
  to a Python file, run `pre-commit run --files <filename>` to ensure
  compliance. Fix **ALL** linting and formatting errors reported.
- Code must be fully documented and include type annotations for all
  functions, methods, classes, packages, types, and variables/constants of
  global scope. Use reStructuredText/sphinx style for docstrings.
  - Parameters and return values are documented using the `:param` and
    `:returns:` directives in docstrings.
  - Do not repeat type information in docstrings that is already present in
    type annotations.
  - Use `:raises` directive to document any exceptions that a function may
    raise.
  - Include usage examples in docstrings using the `Examples:` section. These
    examples should be written in a way that they can be tested using
    `doctest`.
  - Class constructor parameters should be documented in the `__init__` method
    docstring, not in the class docstring.

Example properly documented and typed code:

```python
MAX_RETRIES: int = 5
"""Maximum number of retries for network operations."""

def divide_numbers(a: float, b: float) -> float:
    """Divide two numbers and return the result.

    :param a: The first number (dividend).
    :param b: The second number (divisor).
    :returns: The quotient of the two numbers.
    :raises ZeroDivisionError: If the divisor is zero.

    Examples:
    >>> divide_numbers(10.0, 2.0)
    5.0
    >>> divide_numbers(5.0, 0.0)
    Traceback (most recent call last):
        ...
    ZeroDivisionError: float division by zero
    """
    return a / b
```

## Code structure

- **Code modularity:** Keep code modular and organized. Each module should
  have a clear purpose and be as small as possible while still being
  functional.
- **Minimize side-effects:** Use functional programming principles where
  possible to avoid unnecessary state and side effects.

## Testing

- All Python code must be covered by unit tests using `pytest`. Use tools and
  libraries like `hypothesis` and `doctest` to enhance test coverage and
  readability.
- Perform coverage analysis using `pytest-cov` to ensure that all new code is
  adequately tested.
- Where possible:
  - Use property-based testing with `hypothesis` to validate code behavior
    across a wide range of inputs.
  - Include `doctest` examples in docstrings to provide usage examples and
    ensure correctness.

## Critical reminders

AFTER MAKING CHANGES TO ANY PYTHON FILE or PROJECT CONFIGURATION you MUST
carry out the following steps without exception:

- Run the tests: `uv run pytest`
- Run the type checker: `uv run pyright`
- Run the formatter: `uv tool run ruff format`
- Run the linter: `uv tool run ruff check`

Any issues found by the above commands MUST be fixed before declaring the
changes complete.
