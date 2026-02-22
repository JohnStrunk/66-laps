@browser
Feature: Back Button Navigation

  As a PWA user
  I want my device's back button to navigate through the application screens
  So that I don't accidentally exit the app when I just want to go back a level

  Background:
    Given the app is loaded

  Scenario: Back button from history returns to main menu
    Given I am on the "History" screen
    When I press the device back button
    Then I should be on the main menu

  Scenario: Back button from race returns to main menu
    Given a race is in progress
    When I press the device back button
    Then I should be on the main menu

  Scenario: Back button from race details returns to history
    Given I have completed several races
    And I am on the "History" screen
    And I click on the first race record
    When I press the device back button
    Then I should be on the "History" screen
    And I press the device back button
    Then I should be on the main menu
