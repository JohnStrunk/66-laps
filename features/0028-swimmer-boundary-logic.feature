Feature: Swimmer Boundary Logic
  Scenario Outline: Swimmer should stay within the pool walls in 2D
    Given start end at <startX> and turn end at <turnX>
    When swimmer is at location <location>
    Then the calculated position X should be <expectedPosX>
    And the calculated anchor X should be <expectedAnchorX>
    And the swimmer's representation should be bounded by <minX> and <maxX>

    Examples:
      | startX | turnX | location | expectedPosX | expectedAnchorX | minX | maxX |
      | 0      | 100   | 0        | 0            | 0               | 0    | 100  |
      | 0      | 100   | 1        | 100          | 1               | 0    | 100  |
      | 100    | 0     | 0        | 100          | 1               | 0    | 100  |
      | 100    | 0     | 1        | 0            | 0               | 0    | 100  |

  @browser @practice @3d
  Scenario Outline: 3D Swimmer should stay within the pool walls
    Given I navigate to the Practice tool
    And I set the "Starting End" setting to "<startingEnd>"
    And I set the "Simulation Mode" setting to "3D Perspective"
    When I click "Start"
    Then the 3D swimmer in lane 0 should be within the pool boundaries at start and turn ends

    Examples:
      | startingEnd |
      | Left        |
      | Right       |
