@browser
Feature: Back Button Saves Race History
  When I am in a race and have registered touches
  I want the back button to save the race to history
  So that I don't lose my race data when navigating away

  Background:
    Given the app is loaded

  Scenario: Back button from race saves to history when touches exist
    Given a race is in progress
    And I tap the Zone B area for Lane 1
    When I press the device back button
    Then I should be on the main menu
    And I navigate to the "History" screen
    Then I should see a list of records
    And the history should contain 1 races

  Scenario: Exit button from race saves to history when touches exist
    Given a race is in progress
    And I tap the Zone B area for Lane 1
    When I tap the "Exit" button in the header
    Then I should be on the main menu
    And I navigate to the "History" screen
    Then I should see a list of records
    And the history should contain 1 races

  Scenario: Back button from race does not save to history when no touches exist
    Given a race is in progress
    When I press the device back button
    Then I should be on the main menu
    And I navigate to the "History" screen
    Then I should see the "No race history recorded yet" message
    And the history should contain 0 races
