@browser
Feature: Visual Regression

  As a developer
  I want to ensure the UI remains visually consistent across changes
  So that I don't accidentally break the layout or styling

  Background:
    Given the app is loaded
    And the race is a 500 SC event (20 laps total)

  Scenario: Lane row visual states
    # Default State
    Then Lane 1 should match its "lane-active" snapshot

    # Locked State
    When I tap the Zone B area for Lane 1
    Then Lane 1 should match its "lane-locked" snapshot

    # Bell Lap State
    When Lane 1 is on Lap 16
    Then Lane 1 should match its "lane-bell-lap" snapshot

    # Finished State
    When Lane 1 is on Lap 20
    Then Lane 1 should match its "lane-finished" snapshot
