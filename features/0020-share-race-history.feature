@browser @share
Feature: Share Race History

  As a swim coach or official
  I want to generate and share a PDF of a race history
  So that I have a permanent record of the race results and splits

  Background:
    Given the app is loaded
    And the browser is ready for PDF actions
    And I am on the main menu
    And I have completed several races

  Scenario: Share button is visible on history records
    When I navigate to the "History" screen
    Then I should see a "share" icon button on each race record
    And I should see a "download" icon button on each race record

  Scenario: Share button is visible on race details screen
    When I navigate to the "History" screen
    And I click on the first race record
    Then I should see the race details screen
    And I should see a "share" icon button at the top of the screen
    And I should see a "download" icon button at the top of the screen

  Scenario: Download PDF has correct filename format
    When I navigate to the "History" screen
    And I click the "download" button for the first race record
    Then the downloaded PDF should have a filename matching "Race-\d{10}(-E\d+)?(-H\d+)?\.pdf"

  Scenario: Share PDF of a race history (supported)
    Given the browser supports file sharing
    When I navigate to the "History" screen
    And I click the "share" button for the first race record
    Then the system share dialog should be opened with the PDF file

  Scenario: Share PDF of a race history (unsupported)
    Given the browser does not support file sharing
    When I navigate to the "History" screen
    And I click the "share" button for the first race record
    Then a PDF file should be generated and downloaded as a fallback
