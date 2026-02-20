@browser
Feature: New Race Configuration
  As a swim meet official
  I want to configure the race parameters in a dialog
  So that I can set all the information before starting the race

  Background:
    Given the app is loaded

  Scenario: Configuration dialog opens automatically on first launch
    Then the "New Race Setup" dialog should be visible

  Scenario: New Race Setup dialog contains all required fields
    Given the "New Race Setup" dialog is open
    Then I should see an "Event Selection" dropdown
    And I should see a "Lanes" dropdown
    And I should see an "Event Number" field
    And I should see a "Heat Number" field
    And I should see a "Start Race" button

  Scenario: Configuring and starting a new race with optional info
    Given the "New Race Setup" dialog is open
    When I select "1000 SC" from the Event Selection dropdown
    And I select "6 lanes" from the Lanes dropdown
    And I enter "15" in the Event Number field
    And I enter "2" in the Heat Number field
    And I tap the "Start Race" setup button
    Then the "New Race Setup" dialog should be closed
    And the header should display "1000 SC"
    And the header should display "Event 15"
    And the header should display "Heat 2"
    And there should be 6 lane rows displayed

  Scenario: Configuring and starting a new race without optional info
    Given the "New Race Setup" dialog is open
    When I select "500 SC" from the Event Selection dropdown
    And I select "8 lanes" from the Lanes dropdown
    And I clear the Event Number field
    And I clear the Heat Number field
    And I tap the "Start Race" setup button
    Then the "New Race Setup" dialog should be closed
    And the header should display "500 SC"
    And the header should not display "Event"
    And the header should not display "Heat"

  Scenario: Reset button opens the configuration dialog with current settings
    Given Bell Lap is configured for a "500 SC" event with 8 lanes
    And the event number is "10" and the heat number is "1"
    When I tap the "Reset" button
    Then the "New Race Setup" dialog should be visible
    And the "Event Selection" dropdown should have "500 SC" selected
    And the "Lanes" dropdown should have "8 lanes" selected
    And the "Event Number" field should contain "10"
    And the "Heat Number" field should contain "1"

  Scenario: Starting a new race clears all previous data
    Given a race is in progress with non-zero counts
    And the "New Race Setup" dialog is open
    When I tap the "Start Race" setup button
    Then all lane counts should be 0
    And all split history should be cleared

  Scenario: Canceling the dialog preserves current data and closes the dialog
    Given a race is in progress with non-zero counts
    And the "New Race Setup" dialog is open
    When I tap the "Cancel" setup button
    Then the lane counts should remain unchanged
    And the "New Race Setup" dialog should be closed

  Rule: Each event has the correct number of laps
    Scenario Outline: Event selection updates race parameters
      Given Bell Lap is configured for a "<event>" event
      Then the total lap count should be <laps>

      Examples:
        | event   | laps |
        | 500 SC  | 20   |
        | 1000 SC | 40   |
        | 1650 SC | 66   |
        | 800 LC  | 16   |
        | 1500 LC | 30   |
