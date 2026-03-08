Feature: 3D Pool Details
  As a user viewing the 3D practice simulation
  I want to see a realistic pool layout with water 0.5m below the deck
  And lane numbers on panels at the end of each lane

  Background:
    Given I navigate to the Practice tool
    And I set the "Simulation Mode" setting to "3D Perspective"
    And I click "Start"

  @browser @practice @3d
  Scenario: Water surface is 0.5m below the top of the pool deck
    Then the 3D water surface should be at a Y-coordinate of -0.5
    And the 3D pool deck should be at a Y-coordinate of 0.0

  @browser @practice @3d
  Scenario: Lane ropes and swimmers are at the water level
    Then the 3D lane ropes should be at a Y-coordinate of -0.5
    And the 3D swimmers should be at a Y-coordinate of -0.5

  @browser @practice @3d
  Scenario: Lane numbers are placed on white panels at the end of each lane
    Then I should see 3D lane markers for each lane
    And each 3D lane marker should be a white panel 0.33m square
    And each 3D lane marker should be oriented parallel to the side walls
    And each 3D lane marker should be placed on the deck at the end of the lane

  @browser @practice @3d
  Scenario: Backstroke flags are positioned correctly
    Then I should see backstroke flags in the 3D scene
    And the backstroke flags should be placed 5m from each end of the pool
    And the backstroke flag poles should be 2m above the water level
    And the backstroke flags should span the width of the pool
    And there should be 7 pennants over each lane
