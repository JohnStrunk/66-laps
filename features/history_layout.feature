Feature: Race history list layout on mobile

  Rule: When viewing the race history list on a mobile device, the race type and date/time shall appear on a single line without wrapping.

  Scenario: Race type and date/time stay on one line on mobile
    Given the viewport width is set to 375px
    And the app is loaded
    And I have completed several races
    And the user navigates to the race history screen
    When the history list is displayed
    Then each history record shows the race event and start time on the same line
    And any overflow text is truncated with an ellipsis
    And the full event and timestamp are available via the element's title attribute
