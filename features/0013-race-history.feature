@browser
Feature: Race History Recording and Viewing
  As a coach or official
  I want the app to keep a record of all races and their lap count changes
  So that I can review the races later or correct mistakes

  Scenario: Empty history has no scrollbar
    Given the app is loaded
    And I have no races in my history
    When I navigate to the "History" screen
    Then I should see the "No race history recorded yet" message
    And the history view should not be scrollable

  Scenario: Recording a touch event
    Given the app is loaded
    And Bell Lap is configured for a "500 SC" event
    When I tap the Zone B area for Lane 1
    Then lane 1 history should contain a "touch" event from 0 to 2
    And all events in lane 1 history should be timestamped

  Scenario: Recording manual adjustments
    Given the app is loaded
    And Bell Lap is configured for a "500 SC" event
    When I tap the "+" button in Zone A for Lane 2
    And I tap the "-" button in Zone A for Lane 2
    Then lane 2 history should contain a "manual_increment" event from 0 to 2
    And lane 2 history should contain a "manual_decrement" event from 2 to 0
    And all events in lane 2 history should be timestamped

  Scenario: Recording race metadata
    Given the app is loaded
    And Bell Lap is configured for event 5 heat 2 for "800 LC"
    Then the race record should include event 5, heat 2, and length "800 LC"

  Scenario: Viewing race history
    Given the app is loaded
    And I have completed several races
    When I navigate to the "History" screen
    Then I should see a list of records
    And each record should show the start time, distance, lane count, event, and heat
    And the records should be ordered chronologically with the most recent at the top

  Scenario: History limit
    Given the app is loaded
    And I have 50 races in my history
    When I complete a new race
    Then the history should still only contain 50 races
    And the oldest race should have been removed
