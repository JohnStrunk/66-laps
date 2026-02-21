@browser
Feature: Lap count boundaries

  As a lane counter
  I want the lap count to stay within valid boundaries (0 to max laps)
  So that I don't accidentally enter invalid race data

  Background:
    Given the app is loaded
    And a race is in progress

  Scenario Outline: Lap count cannot exceed max laps for <event>
    Given Bell Lap is configured for a "<event>" event
    When Lane 1 is on Lap <total_laps>
    And I attempt to tap the "+" button in Zone A for Lane 1
    Then the lap count for Lane 1 should be <total_laps>
    And the "+" button in Zone A for Lane 1 should be disabled

    Examples:
      | event   | total_laps |
      | 500 SC  | 20         |
      | 1000 SC | 40         |
      | 1650 SC | 66         |
      | 800 LC  | 16         |
      | 1500 LC | 30         |

  Scenario Outline: Lap count cannot go below 0 for <event>
    Given Bell Lap is configured for a "<event>" event
    When Lane 1 is on Lap 0
    And I attempt to tap the "-" button in Zone A for Lane 1
    Then the lap count for Lane 1 should be 0
    And the "-" button in Zone A for Lane 1 should be disabled

    Examples:
      | event   | total_laps |
      | 500 SC  | 20         |
      | 1500 LC | 30         |
