Feature: Practice Restart Button

  Background:
    Given I am on the practice page

  @browser @practice
  Scenario: Restart button is available on the simulation screen
    When I configure a practice race and click "Start"
    Then I should see the "Restart" button in the corner
    And I should see the "Back to Settings" button in the corner

  @browser @practice
  Scenario: Restarting the simulation re-draws swimmers
    When I configure a practice race and click "Start"
    Then I save the current swimmer names
    When I click the "Restart" button
    Then I should still be on the simulation screen
    And the swimmer names should be different from the saved names
