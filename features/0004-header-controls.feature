Feature: Header Controls
  When managing a swimming heat
  I want to use the header controls
  So that I can configure the race, reset the heat, and view the live leaderboard

  Background:
    Given the app is loaded

  Rule: Configuration Controls
    Scenario Outline: Event selection updates race parameters (SC: 15s lockout, LC: 30s lockout)
      When I select "<event>" from the Event Dropdown
      Then the total lap count should be <laps>
      And the lockout duration should be <lockout> seconds

      Examples:
        | event   | laps | lockout |
        | 500 SC  | 20   | 15      |
        | 1000 SC | 40   | 15      |
        | 1650 SC | 66   | 15      |
        | 800 LC  | 16   | 30      |
        | 1500 LC | 30   | 30      |

    Scenario: Lane count selection updates the stack
      When I select "6 lanes" from the Lane Dropdown
      Then the lane stack should display 6 rows

    Scenario: Flip toggle reverses lane order
      Given the lane stack is currently ordered 1 to 10
      When I toggle the Flip switch
      Then the lane stack should be ordered 10 to 1

  Rule: New Race Reset
    Scenario: New Race button requires confirmation
      When I tap the "New Race" button
      Then a confirmation modal should appear with the title "Start New Race?"

    Scenario: Confirming reset clears all data
      Given a race is in progress with non-zero counts
      And the confirmation modal is open
      When I tap "Confirm"
      Then all lane counts should be 0
      And all split history should be cleared
      And any disabled lanes should be re-enabled
      And the Live Leaderboard should be cleared
      And the modal should close

    Scenario: Canceling reset preserves data
      Given a race is in progress with non-zero counts
      And the confirmation modal is open
      When I tap "Cancel"
      Then the lane counts should remain unchanged
      And the modal should close

  Rule: Live Leaderboard Status
    Scenario: Leaderboard lists active lanes
      Given lanes 1, 3, and 5 are active
      And lanes 2, 4, and 6 are empty
      Then the Live Leaderboard should display lanes 1, 3, and 5
      And the Live Leaderboard should not display lanes 2, 4, and 6

    Scenario: Leaderboard sorts by lap count then time
      Given Lane 1 is on Lap 18
      And Lane 2 is on Lap 20
      And Lane 3 is on Lap 18 but touched earlier than Lane 1
      Then the order in the Leaderboard should be Lane 2, Lane 3, Lane 1

    Scenario: Lanes on the same lap share the same color
      Given Lane 1 is on Lap 18
      And Lane 3 is on Lap 18
      And Lane 5 is on Lap 16
      Then Lane 1 and Lane 3 should have the same color in the Leaderboard
      And Lane 1 and Lane 5 should have different colors in the Leaderboard

    Scenario: Active lanes use distinct palette colors and are not Green
      Given the race is a 500 SC event (20 laps total)
      And Lane 2 is on Lap 18
      Then Lane 2 should display the color associated with Lap 18
      And Lane 2 should not be displayed in Green

    Scenario: Finished lanes are displayed in Green
      Given the race is a 500 SC event (20 laps total)
      And Lane 4 has completed 20 laps
      Then Lane 4 should be displayed in Green in the Leaderboard
