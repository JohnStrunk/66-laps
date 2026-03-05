Feature: Practice Lane Options
  As a user of the Practice tool
  I want to choose from a standard set of lane configurations
  So that the simulation remains realistic

  @browser @practice
  Scenario: Practice lane options are exactly 6, 8, and 10
    Given I navigate to the Practice tool
    When I click the "Number of Lanes" settings dropdown
    Then I should see exactly these options: "6, 8, 10"
