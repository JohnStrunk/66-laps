@browser
Feature: Header Controls
  When managing a swimming heat
  I want to use the header controls
  So that I can view race info and access the setup dialog

  Background:
    Given the app is loaded

  Rule: Header Display
    Scenario: Header displays current race info
      Given Bell Lap is configured for a "1000 SC" event
      And the event number is "15" and the heat number is "2"
      Then the header should display "1000 SC"
      And the header should display "Event 15"
      And the header should display "Heat 2"

    Scenario: Header displays only race distance if no event/heat numbers are set
      Given Bell Lap is configured for a "500 SC" event
      And the event number and heat number are not set
      Then the header should display "500 SC"
      And the header should not display "Event"
      And the header should not display "Heat"

  Rule: Lane Order Control
    Scenario: Lane order dropdown reverses lane order
      Given Bell Lap is configured for a "500 SC" event
      And the lane stack is currently ordered 1 to 10
      When I select "Bottom to top" from the Lane Order Dropdown
      Then the lane stack should be ordered 10 to 1

  Rule: Navigation Control
    Scenario: Exit button returns to the main menu
      Given a race is in progress
      When I tap the "Exit" button in the header
      Then I should be on the main menu

  Rule: Theme Control
    Scenario: Theme toggle cycles through modes
      Given the app is loaded
      When I tap the theme toggle button
      Then the theme should be "dark"
      When I tap the theme toggle button
      Then the theme should be "light"
      When I tap the theme toggle button
      Then the theme should be "system"

  Rule: Responsiveness
    Scenario Outline: Header fits on various mobile screens
      Given the app is loaded
      And the viewport is "<viewport>"
      And Bell Lap is configured for a 10-lane event
      And all lanes are active
      And all lanes have a lap count of 20
      Then the header should not overflow or scroll

      Examples:
        | viewport |
        | 320x568  |
        | 430x932  |

  Rule: Leaderboard
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
      Given Bell Lap is configured for a "500 SC" event
      And Lane 2 is on Lap 18
      Then Lane 2 should display the color associated with Lap 18
      And Lane 2 should not be displayed in Green

    Scenario: Finished lanes are displayed in Green
      Given Bell Lap is configured for a "500 SC" event
      And Lane 4 has completed 20 laps
      Then Lane 4 should be displayed in Green in the Leaderboard
