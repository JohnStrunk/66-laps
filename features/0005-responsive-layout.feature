@browser
Feature: Responsive Layout and Scaling
  When using the Bell Lap PWA on various mobile devices
  I want the UI to automatically scale and fit within the viewport without scrolling
  So that I have a consistent, touch-optimized experience on all screen sizes

  Background:
    Given the app is loaded
    And a race is in progress

  Scenario Outline: UI fits for different lane counts and mobile viewports
    Given Bell Lap is configured for a <count>-lane event
    And the viewport is "<viewport>"
    Then the entire UI should fit on-screen without scrolling
    And the header should be at least "48px" tall
    And the lane stack should fill the remaining space

    Examples:
      | count | viewport |
      | 6     | 360x640  |
      | 8     | 360x640  |
      | 10    | 360x640  |
      | 6     | 430x932  |
      | 8     | 430x932  |
      | 10    | 430x932  |

  Scenario: UI scales on a large phone screen
    Given the viewport is "430x932"
    Then the entire UI should fit on-screen without scrolling
    And the lane stack should be taller than on a "360x640" viewport

  Scenario: Safe areas are respected
    Given the device has a "20px" top safe area inset
    Then the UI should respect the top safe area inset

  Scenario Outline: UI adapts to landscape orientation on mobile screens
    Given the viewport is "<viewport>"
    When the device is rotated to landscape
    Then the UI should adapt to landscape orientation

    Examples:
      | viewport |
      | 390x844  |
      | 430x932  |

  Scenario: Tablets and large screens allow flexible orientation and width
    Given the viewport is "768x1024"
    When the device is rotated to landscape
    Then the UI should adapt to landscape orientation
    And the UI width should not be constrained to portrait dimensions

  Scenario: Desktop layout displays simulated mobile device and mobile usage message
    Given the viewport is "1280x900"
    Then a simulated mobile device should be visible
    And it should display the message "Count laps from your phone:\n66-laps.com/app" below the device
