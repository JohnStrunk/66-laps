Feature: PDF Timeline Scaling
  As a coach reviewing a PDF
  I want the timeline markers to scale appropriately based on race duration
  So that short races have precise markers and long races are readable

  Scenario Outline: Timeline markers scale with duration and restricted height
    Given a race duration of <duration> seconds and available height of <height>
    When I calculate the timeline scale
    Then the seconds per marker should be <marker_interval>
    And the line height should be <line_height>

    Examples:
      | duration | height | marker_interval | line_height |
      | 60       | 800    | 15              | 18          |
      | 300      | 100    | 60              | 11.7647     |
      | 1200     | 200    | 60              | 8.5106      |
      | 3600     | 10     | 600             | 1.0526      |
      | 0        | 500    | 15              | 18          |
      | 100      | -50    | 600             | -11.1111    |
