@browser
Feature: New Race Configuration
  As a swim meet official
  I want to configure the race parameters in a dialog
  So that I can set all the information before starting the race

  Background:
    Given the app is loaded

  Scenario: Main menu is visible on first launch
    Then I should see the main menu

  Scenario: New Race Setup dialog contains all required fields
    When I tap the "New Race" button
    Then I should see an "Event Selection" dropdown
    And I should see a "Lanes" dropdown
    And I should see an "Event Number" field
    And I should see a "Heat Number" field
    And I should see a "Start Race" button

  Scenario: Configuring and starting a new race with optional info
    Given I am on the main menu
    When I tap the "New Race" button
    And I select "1000 SC" from the Event Selection dropdown
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
    Given I am on the main menu
    When I tap the "New Race" button
    And I select "500 SC" from the Event Selection dropdown
    And I select "8 lanes" from the Lanes dropdown
    And I clear the Event Number field
    And I clear the Heat Number field
    And I tap the "Start Race" setup button
    Then the "New Race Setup" dialog should be closed
    And the header should display "500 SC"
    And the header should not display "Event"
    And the header should not display "Heat"

  Scenario: Exit button returns to the main menu
    Given a race is in progress
    When I tap the "Exit" button in the header
    Then I should be on the main menu

  Scenario: Starting a new race clears all previous data
    Given a race is in progress with non-zero counts
    When I tap the "Exit" button in the header
    And I tap the "New Race" button
    And I tap the "Start Race" setup button
    Then all lane counts should be 0
    And all split history should be cleared

  Scenario: Canceling the dialog preserves current data and closes the dialog
    Given a race is in progress with non-zero counts
    And I tap the "Exit" button in the header
    And I tap the "New Race" button
    When I tap the "Cancel" setup button
    Then the "New Race Setup" dialog should be closed


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
