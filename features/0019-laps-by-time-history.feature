@browser
Feature: Laps by time history
  When analyzing a completed race
  I want to see lap counts positioned on a vertical timeline
  So that I can visualize the distribution of effort and timing across all lanes

  Background:
    Given the app is loaded
    And I have a race in my history with the following events:
      | Lane | Lap | Timestamp |
      | 1    | 2   | 10000     |
      | 2    | 2   | 11000     |
      | 1    | 4   | 40000     |
      | 2    | 4   | 42000     |
      | 1    | 6   | 70000     |
    And I am on the "History" screen
    When I click on the first race record
    And I tap the "Laps by time" button

  Scenario: Viewing the timeline grid
    Then the "Laps by time" tab should be active
    And I should see lane headers from 1 to 8
    And I should see "2" in lane 1 at approximately "00:10"
    And I should see "2" in lane 2 at approximately "00:11"
    And I should see "4" in lane 1 at approximately "00:40"
    And I should see "4" in lane 2 at approximately "00:42"

  Scenario: Time markers alignment
    Then I should see a time label for "00:00"
    And I should see a time marker for "00:15"
    And I should see a time marker for "00:30"
    And I should see a time marker for "00:45"
    And I should see a time label for "01:00"
    And I should see a time marker for "01:15"
