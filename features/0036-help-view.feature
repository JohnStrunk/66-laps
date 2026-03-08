Feature: App Help Instructions
  When I am on the main menu
  I want to view instructions on how to use the app
  So that I can understand how to count laps and view history

  Scenario: Navigate to help view
    Given the app is loaded
    And I am on the main menu
    When I tap the "Help" button
    Then I should see the help instructions
    And I should see a section about "Counting Laps"
    And I should see a section about "History"

  Scenario: Return from help view
    Given the app is loaded
    And I am viewing the help instructions
    When I tap the back button
    Then I should be returned to the main menu
