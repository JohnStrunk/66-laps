@browser
Feature: Delete Race History

  As a user of the Bell Lap PWA
  I want to be able to delete individual races or my entire history
  To keep my history list tidy and remove unwanted records

  Background:
    Given the app is loaded
    And I am on the main menu
    And I have several completed races in my history
    And I am on the "History" screen

  Scenario: Delete a single race from history
    When I click the delete button for the first race in history
    Then I should see a confirmation dialog for deleting the race
    When I confirm the deletion
    Then the first race should be removed from the history
    And I should see 2 races remaining in history

  Scenario: Cancel deleting a single race
    When I click the delete button for the first race in history
    Then I should see a confirmation dialog for deleting the race
    When I cancel the deletion
    Then the first race should still be in the history
    And I should see 3 races remaining in history

  Scenario: Delete all race history
    When I click the "Delete all" button at the bottom of the history
    Then I should see a confirmation dialog for deleting all history
    When I confirm deleting all history
    Then the history should be empty
    And I should see the text "No race history recorded yet." on the screen

  Scenario: Cancel deleting all race history
    When I click the "Delete all" button at the bottom of the history
    Then I should see a confirmation dialog for deleting all history
    When I cancel deleting all history
    Then the history should still contain 3 races
