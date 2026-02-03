Feature: Swimmer Model
  While simulating a swimmer's race progress
  I want to determine the swimmer's location and direction
  So that the visualization accurately reflects their current position in the pool

  Scenario: Race starting with even number of laps should start at the starting end
    Given a race with lap times: "30, 40"
    When 0 seconds have elapsed
    Then the swimmer's location should be 0
    And the swimmer's direction should be "TOTURN"

  Scenario: Halfway through the first lap the swimmer should be at the midpoint
    Given a race with lap times: "30, 40"
    When 15 seconds have elapsed
    Then the swimmer's location should be 0.5
    And the swimmer's direction should be "TOTURN"

  Scenario: Swimming during the second lap
    Given a race with lap times: "30, 40"
    When 35 seconds have elapsed
    Then the swimmer's location should be 0.875
    And the swimmer's direction should be "TOSTART"

  Scenario: After completing all laps, the swimmer should be back at the starting end
    Given a race with lap times: "30, 40"
    When 80 seconds have elapsed
    Then the swimmer's location should be 0
    And the swimmer's direction should be "TOSTART"
    And the race should be completed

  Scenario: Single length race start at the turn end
    Given a race with lap times: "10"
    When 0 seconds have elapsed
    Then the swimmer's location should be 1
    And the swimmer's direction should be "TOSTART"

  Scenario: Swimming during a single length race should be towards the starting end
    Given a race with lap times: "10"
    When 3 seconds have elapsed
    Then the swimmer's location should be 0.7
    And the swimmer's direction should be "TOSTART"

  Scenario: Checking race status while in progress
    Given a race with lap times: "30, 40"
    When 50 seconds have elapsed
    Then the race should not be completed

  Scenario: Single lap race status
    Given a race with lap times: "10"
    When 0 seconds have elapsed
    Then the race should not be completed
    When 10 seconds have elapsed
    Then the race should be completed
