Feature: Order of Finish
  As a lap counter using the Practice tool
  I want to see the final order of finish displayed on the pool deck
  So that I know if I counted laps correctly

  Background:
    Given I navigate to the Practice tool

  @browser @practice @2d
  Scenario: Order of finish appears progressively in 2D mode
    Given I configure a practice race with 3 lanes and 2 laps
    And I click "Start"
    When the race is in progress
    Then no order of finish should be displayed
    When lane 2 finishes first
    Then "2" should be displayed in the order of finish on the 2D pool deck
    When lane 1 finishes second
    Then "2 1" should be displayed in the order of finish on the 2D pool deck
    When lane 3 finishes last
    Then "2 1 3" should be displayed in the order of finish on the 2D pool deck

  @browser @practice @3d
  Scenario: Order of finish appears progressively in 3D mode
    Given I configure a 3D practice race with 3 lanes and 2 laps
    And I click "Start"
    When the race is in progress
    Then no order of finish should be displayed
    When lane 3 finishes first
    Then "3" should be displayed in the order of finish on the 3D pool deck
    When lane 2 finishes second
    Then "3 2" should be displayed in the order of finish on the 3D pool deck
    When lane 1 finishes last
    Then "3 2 1" should be displayed in the order of finish on the 3D pool deck
