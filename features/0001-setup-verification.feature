Feature: Setup verification
  The test suite must be correctly configured
  so that developers can reliably run BDD tests.

  Scenario: Cucumber installation and execution
    Given the "@cucumber/cucumber" package is installed
    When I execute the cucumber verification
    Then cucumber should report its version
    And the verification should be successful
