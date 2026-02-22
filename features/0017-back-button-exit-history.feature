@browser
Feature: Back Button and Exit Button History Management

  Background:
    Given the app is loaded

  Scenario: Back button from history after exit does not return to history
    When I navigate to the "History" screen
    And I tap the "Exit" button in the header
    Then I should be on the main menu
    When I navigate to the "History" screen
    And I press the device back button
    Then I should be on the main menu
    When I press the device back button
    Then I should NOT be on the "History" screen

  Scenario: Exit button from race saves the race and goes back
    Given a race is in progress with non-zero counts
    When I tap the "Exit" button in the header
    Then I should be on the main menu
    When I navigate to the "History" screen
    Then the history should contain 1 races

  Scenario: Back button from race details goes back to history correctly
    Given I have completed several races
    When I navigate to the "History" screen
    And I click on the first race record
    Then I should see the race details screen
    When I press the device back button
    Then I should be on the "History" screen
    When I press the device back button
    Then I should be on the main menu
    When I press the device back button
    Then I should NOT be on the "History" screen
