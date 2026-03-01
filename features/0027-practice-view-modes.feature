Feature: Practice View Modes
  As a lap counter using the Practice tool
  I want to choose between a 2D overhead view and a 3D side-pool perspective
  So that I can train in an environment that best simulates real-world counting conditions

  Background:
    Given I navigate to the Practice tool

  @browser @practice @2d
  Scenario Outline: 2D view renders the correct number of lanes
    When I set the "Number of Lanes" setting to "<lanes>"
    And I click "Start"
    Then I should see the 2D PixiJS canvas
    And I should see exactly <lanes> swimmers represented as emojis on the 2D canvas

    Examples:
      | lanes |
      | 6     |
      | 8     |
      | 10    |

  @browser @practice @2d
  Scenario Outline: 2D view lane numbering direction
    When I set the "Lane Numbering" setting to "<direction>"
    And I click "Start"
    Then the lane numbers should be ordered from <order>

    Examples:
      | direction      | order           |
      | Bottom to top  | bottom to top   |
      | Top to bottom  | top to bottom   |

  @browser @practice @2d
  Scenario Outline: 2D view with different race lengths
    When I set the "Race Length" setting to "<length>"
    And I click "Start"
    Then the swimmers should begin moving horizontally along their lanes

    Examples:
      | length  |
      | 500 SC  |
      | 1650 SC |
      | 1500 LC |

  @browser @practice @2d
  Scenario Outline: 2D view with different difficulty and spread settings
    When I set the "Difficulty" setting to "<difficulty>"
    And I set the "Spread" setting to "<spread>"
    And I click "Start"
    Then the swimmers should begin moving horizontally along their lanes

    Examples:
      | difficulty   | spread  |
      | Peaceful     | Minimal |
      | Normal       | Normal  |
      | Hardcore 🖤  | Max     |

  @browser @practice @3d
  Scenario: Practice Settings UI contains new orientation controls
    Then I should see a setting for "Starting End" with options "Left" and "Right"
    And the default "Starting End" should be "Left"

  @browser @practice @3d
  Scenario: View Selector is available on the simulation screen
    When I configure a practice race and click "Start"
    Then I should see a "2D/3D" view selector toggle floating in the corner
    And the view selector should default to "2D"
    And I should see the "Back to Settings" button in the corner

  @browser @practice @3d
  Scenario: Toggling to 3D view displays the React Three Fiber Canvas
    When I configure a practice race and click "Start"
    And I toggle the view selector to "3D"
    Then the 2D PixiJS canvas should be replaced by a 3D R3F Canvas
    And I should see a 3D environment with water and pool walls

  @browser @practice @3d
  Scenario: 2D View rendering logic when Starting End is Left (Default)
    Given the "Starting End" is set to "Left"
    When I configure a practice race and click "Start"
    And the view selector is set to "2D"
    Then the lane numbers should be rendered on the left side of the pool
    And swimmers heading toward the turn end should move from left to right on the screen

  @browser @practice @3d
  Scenario: 2D View rendering logic when Starting End is Right
    Given I set the "Starting End" setting to "Right"
    When I configure a practice race and click "Start"
    And the view selector is set to "2D"
    Then the lane numbers should be rendered on the right side of the pool
    And swimmers heading toward the turn end should move from right to left on the screen

  @browser @practice @3d
  Scenario: 3D Camera perspective logic when Starting End is Left (Default)
    Given the "Starting End" is set to "Left"
    When I configure a practice race and click "Start"
    And I toggle the view selector to "3D"
    Then the 3D camera should be positioned on the deck, looking toward the left
    And the camera should be exactly 3.0 meters from the start end wall
    And the camera height should be fixed at 1.67 meters
    And the horizontal field of view should be 90 degrees

  @browser @practice @3d
  Scenario: 3D Camera perspective logic when Starting End is Right
    Given I set the "Starting End" setting to "Right"
    When I configure a practice race and click "Start"
    And I toggle the view selector to "3D"
    Then the 3D camera should be positioned on the deck, looking toward the right
    And the camera should be exactly 3.0 meters from the start end wall
    And the camera height should be fixed at 1.67 meters
    And the horizontal field of view should be 90 degrees

  @browser @practice @3d
  Scenario: Simulation mode and Starting End settings are not persisted globally
    Given I set the "Starting End" setting to "Right"
    And I configure a practice race and click "Start"
    And I toggle the view selector to "3D"
    When I reload the application
    And I navigate to the Practice tool
    Then the "Starting End" setting should be reset to "Left"
    When I configure a practice race and click "Start"
    Then the view selector should default to "2D"

  @browser @practice @3d
  Scenario: 3D Model Representation Validation
    When I set the "Number of Lanes" setting to "8"
    And I click "Start"
    And I toggle the view selector to "3D"
    Then I should see exactly 8 swimmers in the 3D environment
    And the swimmers should be shaped like low-poly directional pills or cones
    And the swimmers should have distinct solid colors assigned from the predefined palette

  @browser @practice @3d
  Scenario: 3D View Flip Animation Trigger
    When I set the "Race Length" setting to "500 SC"
    And I click "Start"
    And I toggle the view selector to "3D"
    And I wait for a swimmer to reach the turn wall
    Then the swimmer model should perform a quick 180-degree flip animation
