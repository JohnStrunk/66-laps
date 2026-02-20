@browser
Feature: Configuration changes in progress

  As a swim meet official using the Bell Lap app
  I want to be able to change the race configuration without losing progress
  So that I can correct mistakes or adapt to changes during a race

  Background:
    Given the app is loaded

  Scenario: Changing lane count preserves existing lap counts
    Given Bell Lap is configured for a 10-lane event
    And Lane 1 has a lap count of 10
    And Lane 10 has a lap count of 12
    When I select "8 lanes" from the Lane Dropdown
    Then there should be 8 lane rows displayed
    And the lap count for Lane 1 should be 10
    When I select "10 lanes" from the Lane Dropdown
    Then there should be 10 lane rows displayed
    And the lap count for Lane 1 should be 10
    And the lap count for Lane 10 should be 12

  Scenario: Changing race length to shorter preserves lap counts but locks out
    Given Bell Lap is configured for a "1000 SC" event
    And Lane 1 has a lap count of 22
    When I select "500 SC" from the Event Dropdown
    Then the lap count for Lane 1 should be 22
    And the Zone B area for Lane 1 should display "🏁 LANE 1 🏁"
    When I select "1650 SC" from the Event Dropdown
    Then the lap count for Lane 1 should be 22
    And the Zone B area for Lane 1 should be green
    And the Zone B area for Lane 1 should display "LANE 1"
