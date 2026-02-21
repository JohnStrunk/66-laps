@browser
Feature: Main Menu
  As a coach or official
  I want a central hub for starting new races and viewing history
  So that I can easily navigate the app

  Scenario: Initial screen on launch
    Given the app is loaded
    Then I should see the main menu
    And the main menu should have "New Race" and "History" buttons

  Scenario: Starting a new race from the main menu
    Given the app is loaded
    And I am on the main menu
    When I tap the "New Race" button
    Then the new race setup modal should be open

  Scenario: Navigating to history from the main menu
    Given the app is loaded
    And I am on the main menu
    When I tap the "History" button
    Then I should be on the "History" screen
    And the header should say "Race History"

  Scenario: Exiting history to the main menu
    Given the app is loaded
    And I am on the "History" screen
    When I tap the "Exit" button in the header
    Then I should be on the main menu

  Scenario: Exiting a race to the main menu
    Given the app is loaded
    And a race is in progress
    When I tap the "Exit" button in the header
    Then I should be on the main menu
