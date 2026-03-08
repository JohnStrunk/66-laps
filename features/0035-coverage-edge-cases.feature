@browser
Feature: Additional Coverage Edge Cases

  As a developer
  I want to ensure all edge cases in the core logic are covered by tests
  So that the app is robust and reliable

  Background:
    Given the app is loaded

  Scenario: Race start time is based on the first event
    Given Bell Lap is configured for a "500 SC" event
    And I wait 5000 milliseconds
    When I tap the Zone B area for Lane 1
    And I wait 1000 milliseconds
    And I tap the "Exit" button in the header
    Then I should be on the main menu
    And the most recent race in history should have a start time equal to the first touch timestamp

  Scenario: Exiting an idle race does not save to history
    Given Bell Lap is configured for a "500 SC" event
    And I have no races in my history
    When I tap the "Exit" button in the header
    Then I should be on the main menu
    And I should have 0 races in my history

  Scenario: PDF generation with 10 lanes handles layout correctly
    Given I have a "500 SC" race with 10 lanes in my history
    When I navigate to the "History" screen
    And I click the "download" button for the first race record
    Then a PDF file should be generated and downloaded
    And the generated PDF should have an OOF table with 11 columns

  Scenario: Flipped view correctly maps touch targets
    Given Bell Lap is configured for an 8-lane event
    And I toggle the view flip setting
    When I tap the Zone B area for Lane 1
    Then the lap count for Lane 1 should be 2
    And the lap count for Lane 8 should be 0

  Scenario: Swimmer model boundary exactly at lap completion
    Given a race with lap times: "30, 30"
    When 30 seconds have elapsed
    Then the swimmer's location should be 1
    And the swimmer's direction should be "TOSTART"
    When 60 seconds have elapsed
    Then the swimmer's location should be 0
    And the swimmer's direction should be "TOSTART"
    And the race should be completed
