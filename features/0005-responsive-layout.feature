Feature: Responsive Layout and Scaling
  When using the Bell Lap PWA on various mobile devices
  I want the UI to automatically scale and fit within the viewport without scrolling
  So that I have a consistent, touch-optimized experience on all screen sizes

  Background:
    Given the app is loaded

  Scenario Outline: UI fits for different lane counts on small screen
    Given Bell Lap is configured for a <count>-lane event
    And the viewport is "360x640"
    Then the entire UI should fit on-screen without scrolling
    And the header should be at least "48px" tall
    And the lane stack should fill the remaining space

    Examples:
      | count |
      | 6     |
      | 8     |
      | 10    |

  Scenario: UI scales on a large phone screen
    Given the viewport is "430x932"
    Then the entire UI should fit on-screen without scrolling
    And the lane stack should be taller than on a "360x640" viewport

  Scenario: Safe areas are respected
    Given the device has a "20px" top safe area inset
    Then the UI should respect the top safe area inset

  Scenario: Portrait orientation is enforced on small screens
    Given the viewport is "390x844"
    When the device is rotated to landscape
    Then the UI should remain in portrait orientation

  Scenario: Tablets and large screens allow flexible orientation and width
    Given the viewport is "768x1024"
    When the device is rotated to landscape
    Then the UI should adapt to landscape orientation
    And the UI width should not be constrained to portrait dimensions
