Feature: Race end symbols for all distances

  As a lane counter
  I want to see visual cues as the race approaches its end for any race distance
  So that I can prepare for the finish regardless of the event

  Background:
    Given the app is loaded

  Scenario Outline: Display symbols at correct laps for "<event>"
    And the race is a <event> event (<total_laps> laps total)

    # N-4: Bell
    When Lane 1 is on Lap <bell_lap>
    Then the Zone B area for Lane 1 should display "🔔 LANE 1 🔔"

    # N-2: Red Square
    When Lane 1 is on Lap <red_square_lap>
    Then the Zone B area for Lane 1 should display "🟥 LANE 1 🟥"

    # N: Checkered Flag
    When Lane 1 is on Lap <total_laps>
    Then the Zone B area for Lane 1 should display "🏁 LANE 1 🏁"
    And the Zone B area for Lane 1 should be disabled

    Examples:
      | event   | total_laps | bell_lap | red_square_lap |
      | 500 SC  | 20         | 16       | 18             |
      | 1000 SC | 40         | 36       | 38             |
      | 1650 SC | 66         | 62       | 64             |
      | 800 LC  | 16         | 12       | 14             |
      | 1500 LC | 30         | 26       | 28             |
