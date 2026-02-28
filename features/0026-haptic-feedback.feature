@browser
Feature: Haptic Feedback

  As a user of the Bell Lap app
  I want to feel a haptic vibration when I successfully increment a lap count
  So that I have tactile confirmation of my action

  Background:
    Given Bell Lap is configured for an 8-lane event
    And Bell Lap is configured for a "500 SC" event

  Scenario: Tapping Zone B provides haptic feedback on successful increment
    When I tap the Zone B area for Lane 1 in the UI
    Then the lap count for Lane 1 should be 2
    And haptic feedback should have been triggered

  Scenario: Tapping Zone B does not provide haptic feedback when locked out
    When I tap the Zone B area for Lane 1 in the UI
    Then the lap count for Lane 1 should be 2
    And I tap the Zone B area for Lane 1 in the UI
    Then the lap count for Lane 1 should be 2
    And haptic feedback should have been triggered exactly 1 time

  Scenario: Tapping Zone B does not provide haptic feedback when race is finished
    Given all lanes have a lap count of 20
    When I tap the Zone B area for Lane 1 in the UI
    Then the lap count for Lane 1 should be 20
    And haptic feedback should not have been triggered
