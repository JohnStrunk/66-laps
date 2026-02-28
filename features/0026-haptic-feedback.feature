@browser
Feature: Haptic Feedback

  As a user of the Bell Lap app
  I want to feel a haptic vibration when I successfully increment a lap count
  So that I have tactile confirmation of my action

  Background:
    Given Bell Lap is configured for an 8-lane event
    And Bell Lap is configured for a "500 SC" event
    And I clear haptic feedback history

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

  Scenario: Long pressing a lane provides stronger haptic feedback (disabling)
    When I long press the row for Lane 1
    Then Lane 1 should be displayed as a full-width empty state
    And haptic feedback should have been triggered with pattern "[100,50,100]"

  Scenario: Long pressing an empty lane provides stronger haptic feedback (re-enabling)
    Given Lane 2 is marked as "EMPTY"
    When I long press the row for Lane 2
    Then Lane 2 should be active
    And haptic feedback should have been triggered with pattern "[100,50,100]"

  Scenario: Tapping a disabled lane does not provide haptic feedback
    Given Lane 3 is marked as "EMPTY"
    And I clear haptic feedback history
    When I tap the row for Lane 3 in the UI
    Then haptic feedback should not have been triggered
