Feature: PWA Appearance and Interaction

  As a swim meet official using the Bell Lap app
  I want a clear and intuitive interface for tracking laps
  So that I can accurately count for swimmers with minimal distraction

  Background:
    Given the app is loaded

  Scenario: Zone B displays "Lane X" text
    Then each lane's Zone B should display "Lane" followed by its lane number
    And each lane's Zone B should not display the current lap count

  Scenario: Zone A displays prominent lap count
    Then each lane's Zone A should display the current lap count prominently

  Scenario: Zone B visual feedback for active and locked states (SC: 15s lockout)
    Given the race is a 500 SC event (20 laps total)
    And lane 1 is active
    Then the Zone B area for Lane 1 should be green

    When I tap the Zone B area for Lane 1
    Then the Zone B area for Lane 1 should be in lockout state
    And the Zone B area for Lane 1 should display a progress indicator for the lockout duration

    When 15 seconds have elapsed
    Then the Zone B area for Lane 1 should be green

  Scenario: Zone B visual feedback for active and locked states (LC: 30s lockout)
    Given the race is a 1500 LC event (30 laps total)
    And lane 1 is active
    Then the Zone B area for Lane 1 should be green

    When I tap the Zone B area for Lane 1
    Then the Zone B area for Lane 1 should be in lockout state
    And the Zone B area for Lane 1 should display a progress indicator for the lockout duration

    When 30 seconds have elapsed
    Then the Zone B area for Lane 1 should be green

  Scenario: Inactive lanes appear grey with "Empty" text
    When I long press the Zone B area for Lane 2
    Then Lane 2 should be marked as "EMPTY"
    And the Zone B area for Lane 2 should be grey
    And the Zone B area for Lane 2 should display "EMPTY"
