Feature: Lane Stack
  When setting up a swimming heat
  I want to interact with a vertical stack of lane rows
  So that I can track lap counts for each swimmer using manual or touch controls

  Background:
    Given all lanes are initially active with a lap count of 0

  Rule: Lane Configuration
    Scenario Outline: Correct number of lanes are rendered
      Given Bell Lap is configured for a <count>-lane event
      Then there should be <count> lane rows displayed

      Examples:
        | count |
        | 6     |
        | 8     |
        | 10    |

  Rule: Layout and Appearance
    Scenario: Lane rows display two distinct functional zones
      Given Bell Lap is configured for an 8-lane event
      Then each lane row should be split into Zone A and Zone B
      And Zone A should occupy approximately 35% of the width
      And Zone B should occupy approximately 65% of the width

    Scenario: Zone B displays the lane number
      Given Bell Lap is configured for an 8-lane event
      Then each lane's Zone B should display its corresponding lane number as a watermark

  Rule: Manual and Touch Interaction
    Scenario: Tapping the Touch Pad (Zone B) increments count
      Given Bell Lap is configured for an 8-lane event
      When I tap the Zone B area for Lane 1
      Then the lap count for Lane 1 should be 2

    Scenario: Using the manual plus button increments count
      Given Bell Lap is configured for an 8-lane event
      When I tap the "+" button in Zone A for Lane 3
      Then the lap count for Lane 3 should be 2

    Scenario: Using the manual minus button decrements count
      Given Bell Lap is configured for an 8-lane event
      And Lane 5 has a lap count of 4
      When I tap the "-" button in Zone A for Lane 5
      Then the lap count for Lane 5 should be 2

    Scenario: Manual minus button is disabled at zero
      Given Bell Lap is configured for an 8-lane event
      Then the "-" button in Zone A for Lane 1 should be disabled

    Scenario: Tapping Zone B multiple times increments count accordingly
      Given Bell Lap is configured for an 8-lane event
      When I tap the Zone B area for Lane 2
      And I tap the Zone B area for Lane 2
      Then the lap count for Lane 2 should be 4

    Scenario: Touch Pad aria-label updates with count
      Given Bell Lap is configured for an 8-lane event
      When I tap the Zone B area for Lane 4
      Then the aria-label for Lane 4's Zone B should include "Current count: 2"
