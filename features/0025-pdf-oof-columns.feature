@browser @pdf
Feature: PDF OOF Table Columns

  As a swim coach or official
  I want the OOF by lap in the PDF to have lane numbers aligned in columns
  So that I can easily compare the order of finish across different laps

  Background:
    Given the app is loaded
    And the browser is ready for PDF actions
    And I am on the main menu
    And I have a race with 8 lanes in my history

  Scenario: OOF table in PDF has a column for each place
    When I navigate to the "History" screen
    And I click the "download" button for the first race record
    Then the generated PDF should have an OOF table with 9 columns
