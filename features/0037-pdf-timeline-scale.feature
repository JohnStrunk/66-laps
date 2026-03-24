Feature: PDF Timeline Scaling
  As a coach reviewing a PDF
  I want the timeline markers to scale appropriately based on race duration
  So that short races have precise markers and long races are readable

  Scenario Outline: Timeline markers scale with duration
    Given a race duration of <duration> seconds and available height of <height>
    When I calculate the timeline scale
    Then the seconds per marker should be <marker_interval>
    And the line height should be <line_height>

    Examples:
      | duration | height | marker_interval | line_height |
      | 60       | 1000   | 5               | 76.92307    |
      | 120      | 500    | 10              | 38.46153    |
      | 300      | 500    | 15              | 23.80952    |
      | 600      | 800    | 30              | 38.09523    |
      | 1200     | 1000   | 60              | 47.61904    |
      | 30       | 500    | 5               | 50          |
      | 0        | 100    | 5               | 10          |
