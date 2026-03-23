Feature: Practice Tool Defaults
  As a user of the Practice tool
  I want the settings to have sensible defaults
  So that I can quickly start a typical practice session

  @browser @practice
  Scenario: Default race length should be 500 SC
    Given I navigate to the Practice tool
    Then the "Race Length" setting should be "500 SC"

  @browser @practice
  Scenario: Available race distances in Swimulation
    Given I navigate to the Practice tool
    Then the "Race Length" setting should have exactly these options:
      | 50 SC   |
      | 50 LC   |
      | 500 SC  |
      | 1000 SC |
      | 1650 SC |
      | 800 LC  |
      | 1500 LC |
