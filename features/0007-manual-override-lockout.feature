@browser
Feature: Manual Override of Lockout

  As a swim meet official
  I want manual count adjustments to immediately clear any lockout
  So that I can quickly correct mistakes and continue counting

  Background:
    Given the app is loaded
    And the race is a 500 SC event (20 laps total)

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
