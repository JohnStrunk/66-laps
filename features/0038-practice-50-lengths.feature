Feature: Practice 50 Lengths
  As a lap counter using the Practice tool
  I want to select 50 SC and 50 LC races
  So that I can practice for shorter events

  Background:
    Given I navigate to the Practice tool
    And I set the "Simulation Mode" setting to "3D Perspective"

  @browser @practice @3d
  Scenario: 50 SC swimmers should start at the start end
    When I set the "Race Length" setting to "50 SC"
    And I click "Start"
    Then the practice lap count should be 2
    And the 3D swimmers should start at the start end

  @browser @practice @3d
  Scenario: 50 LC swimmers should start at the turn end
    When I set the "Race Length" setting to "50 LC"
    And I click "Start"
    Then the practice lap count should be 1
    And the 3D swimmers should start at the turn end
