Feature: 3D Swimulation - Side-Pool Practice View
  As a lap counter using the Practice tool
  I want a 3D perspective of the pool
  So that I can train in an environment that simulates the real-world view from the pool deck

  Background:
    Given I navigate to the Practice tool

  @e2e @practice @3d
  Scenario: Practice Settings UI contains new orientation controls
    When I click "Settings" on the Practice view
    Then I should see a setting for "Starting End" with options "Left" and "Right"
    And the default "Starting End" should be "Left"

  @e2e @practice @3d
  Scenario: View Selector is available on the simulation screen
    When I configure a practice race and click "Start"
    Then I should see a "2D/3D" view selector toggle floating in the corner
    And the view selector should default to "2D"
    And I should see the "Back to Settings" button in the corner

  @e2e @practice @3d
  Scenario: Toggling to 3D view displays the React Three Fiber Canvas
    When I configure a practice race and click "Start"
    And I toggle the view selector to "3D"
    Then the 2D PixiJS canvas should be replaced by a 3D R3F Canvas
    And I should see a 3D environment with water and pool walls

  @e2e @practice @3d
  Scenario: 2D View rendering logic when Starting End is Left (Default)
    Given the "Starting End" is set to "Left"
    When I configure a practice race and click "Start"
    And the view selector is set to "2D"
    Then the lane numbers should be rendered on the left side of the pool
    And swimmers heading toward the turn end should move from left to right on the screen

  @e2e @practice @3d
  Scenario: 2D View rendering logic when Starting End is Right
    Given I set the "Starting End" setting to "Right"
    When I configure a practice race and click "Start"
    And the view selector is set to "2D"
    Then the lane numbers should be rendered on the right side of the pool
    And swimmers heading toward the turn end should move from right to left on the screen

  @e2e @practice @3d
  Scenario: 3D Camera perspective logic when Starting End is Left (Default)
    Given the "Starting End" is set to "Left"
    When I configure a practice race and click "Start"
    And I toggle the view selector to "3D"
    Then the 3D camera should be positioned on the deck, looking toward the left
    And the camera should be exactly 3.0 meters from the start end wall
    And the camera height should be fixed at 1.67 meters
    And the horizontal field of view should be 90 degrees

  @e2e @practice @3d
  Scenario: 3D Camera perspective logic when Starting End is Right
    Given I set the "Starting End" setting to "Right"
    When I configure a practice race and click "Start"
    And I toggle the view selector to "3D"
    Then the 3D camera should be positioned on the deck, looking toward the right
    And the camera should be exactly 3.0 meters from the start end wall
    And the camera height should be fixed at 1.67 meters
    And the horizontal field of view should be 90 degrees

  @e2e @practice @3d
  Scenario: Simulation mode and Starting End settings are not persisted globally
    Given I set the "Starting End" setting to "Right"
    And I configure a practice race and click "Start"
    And I toggle the view selector to "3D"
    When I reload the application
    And I navigate to the Practice tool
    And I click "Settings" on the Practice view
    Then the "Starting End" setting should be reset to "Left"
    When I configure a practice race and click "Start"
    Then the view selector should default to "2D"

  @e2e @practice @3d
  Scenario: 3D Model Representation Validation
    When I configure a practice race with 8 lanes and click "Start"
    And I toggle the view selector to "3D"
    Then I should see exactly 8 swimmers in the 3D environment
    And the swimmers should be shaped like low-poly directional pills or cones
    And the swimmers should have distinct solid colors assigned from the predefined palette

  @e2e @practice @3d
  Scenario: 3D View Flip Animation Trigger
    Given I set a practice race length to 50
    When I click "Start"
    And I toggle the view selector to "3D"
    And I wait for a swimmer to reach the turn wall
    Then the swimmer model should perform a quick 180-degree flip animation
