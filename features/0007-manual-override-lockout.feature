@browser
Feature: Manual Override of Lockout

  As a swim meet official
  I want manual count adjustments to immediately clear any lockout
  So that I can quickly correct mistakes and continue counting

  Background:
    Given the app is loaded
    And a race is in progress
    And Bell Lap is configured for a "500 SC" event

  Scenario: Pressing + disables lockout
    When I tap the Zone B area for Lane 1
    Then the Zone B area for Lane 1 should be in lockout state

    When I tap the "+" button in Zone A for Lane 1
    Then the Zone B area for Lane 1 should be green

  Scenario: Pressing - disables lockout
    When I tap the Zone B area for Lane 1
    Then the Zone B area for Lane 1 should be in lockout state

    When I tap the "-" button in Zone A for Lane 1
    Then the Zone B area for Lane 1 should be green

  Scenario: Touch is registered immediately after manual increment
    When I tap the Zone B area for Lane 1
    And I tap the "+" button in Zone A for Lane 1
    And I tap the Zone B area for Lane 1 in the UI
    Then the lap count for Lane 1 should be 6

  Scenario: Pressing - at 0 laps does not go below 0
    Given all lanes have a lap count of 0
    When I attempt to tap the "-" button in Zone A for Lane 1
    Then the lap count for Lane 1 should be 0

  Scenario: Pressing + at maximum laps does not exceed maximum
    Given all lanes have a lap count of 20
    When I attempt to tap the "+" button in Zone A for Lane 1
    Then the lap count for Lane 1 should be 20
