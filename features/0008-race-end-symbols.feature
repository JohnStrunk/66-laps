@browser
Feature: Race end symbols

  As a lane counter
  I want to see visual cues as the race approaches its end
  So that I can prepare for the finish regardless of the event

  Background:
    Given the app is loaded

  Scenario Outline: Do not display symbols before N-4 laps
    Given the race is a <event> event (<total_laps> laps total)
    When Lane 1 is on Lap <pre_bell_lap>
    Then the Zone B area for Lane 1 should display "LANE 1"
    And the Zone B area for Lane 1 should not display any emojis

    Examples:
      | event   | total_laps | pre_bell_lap |
      | 500 SC  | 20         | 14           |
      | 800 LC  | 16         | 10           |

  Scenario Outline: Display symbols at correct laps for various race distances
    Given the race is a <event> event (<total_laps> laps total)

    # N-4: Bell
    When Lane 1 is on Lap <bell_lap>
    Then the Zone B area for Lane 1 should display "🔔 LANE 1 🔔"

    # N-2: Red Square
    When Lane 1 is on Lap <red_square_lap>
    Then the Zone B area for Lane 1 should display "🟥 LANE 1 🟥"

    # N: Checkered Flag
    When Lane 1 is on Lap <total_laps>
    Then the Zone B area for Lane 1 should display "🏁 LANE 1 🏁"
    And the Zone B area for Lane 1 should have white background and black text
    And the Zone B area for Lane 1 should be disabled
    And the Zone B area for Lane 1 should not display a progress indicator for the lockout duration

    Examples:
      | event   | total_laps | bell_lap | red_square_lap |
      | 500 SC  | 20         | 16       | 18             |
      | 1000 SC | 40         | 36       | 38             |
      | 1650 SC | 66         | 62       | 64             |
      | 800 LC  | 16         | 12       | 14             |
      | 1500 LC | 30         | 26       | 28             |

  Scenario Outline: Symbols fit on a single line on small mobile screens
    Given the viewport is "360x640"
    And the race is a <event> event (<total_laps> laps total)
    When Lane 1 is on Lap <lap>
    Then the Zone B area for Lane 1 should display "<expected_text>"
    And the text in Zone B for Lane 1 should not wrap or overflow

    Examples:
      | event   | total_laps | lap | expected_text |
      | 500 SC  | 20         | 16  | 🔔 LANE 1 🔔  |
      | 500 SC  | 20         | 18  | 🟥 LANE 1 🟥  |
      | 500 SC  | 20         | 20  | 🏁 LANE 1 🏁  |
