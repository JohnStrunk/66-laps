Feature: Race end symbols

  As a lane counter
  I want to see visual cues as the race approaches its end
  So that I can prepare for the finish

  Background:
    Given the app is loaded
    And the race is a 500 SC event (20 laps total)

  Scenario: Do not display symbols before N-4 laps
    Given Lane 1 is on Lap 14
    Then the Zone B area for Lane 1 should display "LANE 1"
    And the Zone B area for Lane 1 should not display any emojis

  Scenario: Display bell emojis at N-4 laps
    Given Lane 1 is on Lap 16
    Then the Zone B area for Lane 1 should display "🔔 LANE 1 🔔"

  Scenario: Display red square emojis at N-2 laps
    Given Lane 1 is on Lap 18
    Then the Zone B area for Lane 1 should display "🟥 LANE 1 🟥"

  Scenario: Display checkered flag emojis and disable Zone B at N laps
    Given Lane 1 is on Lap 20
    Then the Zone B area for Lane 1 should display "🏁 LANE 1 🏁"
    And the Zone B area for Lane 1 should have white background and black text
    And the Zone B area for Lane 1 should be disabled
