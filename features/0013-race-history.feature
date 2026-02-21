@browser
Feature: Race History Recording
  As a coach or official
  I want the app to keep a record of all lap count changes
  So that I can review the race later or correct mistakes

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
