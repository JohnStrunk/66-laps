Feature: Shader Testing

  @browser
  Scenario: Water shader is correctly compiled and integrated
    Given I navigate to the Practice tool
    And I set the "Simulation Mode" setting to "3D Perspective"
    And I click "Start"
    Then the water shader should be compiled without errors
    And the water shader uColor uniform should match the theme
