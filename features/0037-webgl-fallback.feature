Feature: WebGL Fallback handling
  In order to handle devices that don't support WebGL
  As a user
  I want to see a fallback message when WebGL context creation fails

  Scenario: WebGL context creation fails
    Given I have a device that does not support WebGL
    When I view the Pool3D component
    Then I should see the WebGL fallback message
