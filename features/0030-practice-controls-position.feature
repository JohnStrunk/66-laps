Feature: Practice Controls Position
  As a lap counter using the Practice tool
  I want the controls to be positioned on the same side as the pool start end
  So that they are conveniently located relative to the swimmers' primary focus point

  Background:
    Given I navigate to the Practice tool

  @browser @practice
  Scenario: Controls are on the left when Starting End is Left in 2D
    Given I set the "Starting End" setting to "Left"
    And I set the "Simulation Mode" setting to "2D Overhead"
    When I click "Start"
    Then the practice controls should be positioned on the left side of the screen

  @browser @practice
  Scenario: Controls are on the right when Starting End is Right in 2D
    Given I set the "Starting End" setting to "Right"
    And I set the "Simulation Mode" setting to "2D Overhead"
    When I click "Start"
    Then the practice controls should be positioned on the right side of the screen

  @browser @practice @3d
  Scenario: Controls are on the left when Starting End is Left in 3D
    Given I set the "Starting End" setting to "Left"
    And I set the "Simulation Mode" setting to "3D Perspective"
    When I click "Start"
    Then the practice controls should be positioned on the left side of the screen

  @browser @practice @3d
  Scenario: Controls are on the right when Starting End is Right in 3D
    Given I set the "Starting End" setting to "Right"
    And I set the "Simulation Mode" setting to "3D Perspective"
    When I click "Start"
    Then the practice controls should be positioned on the right side of the screen
