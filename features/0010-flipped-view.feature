@browser
Feature: Flipped View

  As a swim meet official standing on the other side of the pool
  I want to reverse the display order of the lanes
  So that Lane 1 (or the highest lane) matches my physical orientation

  Background:
    Given the app is loaded

  Scenario: Toggling lane order reverses the stack
    Given Bell Lap is configured for an 8-lane event
    Then the lane rows should be ordered from 1 to 8

    When I change the lane order to "8 - 1"
    Then the lane rows should be ordered from 8 to 1
    And the lane order button should display "8 - 1"

    When I change the lane order to "1 - 8"
    Then the lane rows should be ordered from 1 to 8
    And the lane order button should display "1 - 8"
