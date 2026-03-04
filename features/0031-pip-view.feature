Feature: Picture-in-Picture View in 3D Swimulation

  As a viewer of the 3D swimulation
  I want a picture-in-picture (PIP) view of the turn end of the pool
  So that I can see the swimmers approaching the far end.

  Background:
    Given I am on the practice page

  @browser @practice @3d
  Scenario: PIP view is visible in 3D mode
    Given I set the "Number of Lanes" setting to "8"
    And I set the "Race Length" setting to "500 SC"
    And I set the "Simulation Mode" setting to "3D Perspective"
    When I click "Start"
    Then I should see a picture-in-picture view
    And the PIP view should be in the top-right corner when starting end is "LEFT"
    And the PIP view should have a 60 degree field of view

  @browser @practice @3d
  Scenario: PIP view is visible in 3D mode for RIGHT starting end
    Given I set the "Starting End" setting to "Right"
    And I set the "Simulation Mode" setting to "3D Perspective"
    When I click "Start"
    Then the PIP view should be in the top-left corner when starting end is "RIGHT"

  @browser @practice @3d
  Scenario: PIP view shows the turn end
    Given I set the "Starting End" setting to "LEFT"
    And I set the "Simulation Mode" setting to "3D Perspective"
    When I click "Start"
    Then the PIP camera should be at the same position as the main camera
    But the PIP camera should be looking towards the turn end
