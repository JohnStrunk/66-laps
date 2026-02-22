Feature: Race Details
  As a user
  I want to see the details of a previous race
  So that I can review the order of finish for each lap

  @browser
  Scenario: Viewing Lap Order of Finish with latest touch logic
    Given the app is loaded
    And I have a race in my history with the following events:
      | Lane | Lap | Timestamp |
      | 1    | 2   | 1000      |
      | 2    | 2   | 1100      |
      | 1    | 2   | 1200      |
    And I am on the "History" screen
    When I click on the first race record
    Then I should see the race details screen
    And the "Lap OOF" tab should be active
    And for lap 2, the order of finish should be "2, 1"

  @browser
  Scenario: Viewing Lap Order of Finish for a multi-lap race
    Given the app is loaded
    And I have a race in my history with the following events:
      | Lane | Lap | Timestamp |
      | 1    | 2   | 1000      |
      | 2    | 2   | 1100      |
      | 2    | 4   | 2000      |
      | 1    | 4   | 2100      |
      | 1    | 6   | 3000      |
      | 2    | 6   | 3100      |
    And I am on the "History" screen
    When I click on the first race record
    Then I should see the race details screen
    And for lap 2, the order of finish should be "1, 2"
    And for lap 4, the order of finish should be "2, 1"
    And for lap 6, the order of finish should be "1, 2"

  @browser
  Scenario: Viewing race details for a long course event (800 LC)
    Given the app is loaded
    And I have a "800 LC" race in my history with the following events:
      | Lane | Lap | Timestamp |
      | 1    | 2   | 1000      |
      | 1    | 4   | 2000      |
      | 1    | 16  | 8000      |
    And I am on the "History" screen
    When I click on the first race record
    Then I should see the race details screen
    And the header should display "800 LC"
    And for lap 2, the order of finish should be "1"
    And for lap 16, the order of finish should be "1"

  @browser
  Scenario: Viewing race details for a long course event (1650 SC)
    Given the app is loaded
    And I have a "1650 SC" race in my history with the following events:
      | Lane | Lap | Timestamp |
      | 1    | 2   | 1000      |
      | 1    | 66  | 33000     |
    And I am on the "History" screen
    When I click on the first race record
    Then I should see the race details screen
    And the header should display "1650 SC"
    And for lap 2, the order of finish should be "1"
    And for lap 66, the order of finish should be "1"

  @browser
  Scenario: Excluding lanes that did not complete a lap from OOF
    Given the app is loaded
    And I have a "500 SC" race in my history with the following events:
      | Lane | Lap | Timestamp |
      | 1    | 2   | 1000      |
      | 2    | 2   | 1100      |
      | 3    | 2   | 1200      |
      | 4    | 2   | 1300      |
      | 5    | 2   | 1400      |
      | 6    | 2   | 1500      |
      | 1    | 4   | 2000      |
      | 2    | 4   | 2100      |
      | 3    | 4   | 2200      |
      | 4    | 4   | 2300      |
      | 5    | 4   | 2400      |
      | 6    | 4   | 2500      |
      | 1    | 6   | 3000      |
      | 2    | 6   | 3100      |
      | 3    | 6   | 3200      |
      | 4    | 6   | 3300      |
      | 5    | 6   | 3400      |
      | 6    | 6   | 3500      |
      | 1    | 8   | 4000      |
      | 2    | 8   | 4100      |
      | 3    | 8   | 4200      |
      | 4    | 8   | 4300      |
      | 6    | 8   | 4500      |
    And I am on the "History" screen
    When I click on the first race record
    Then I should see the race details screen
    And for lap 6, the order of finish should be "1, 2, 3, 4, 5, 6"
    And for lap 8, the order of finish should be "1, 2, 3, 4, 6"

  @browser
  Scenario: 10-lane layout on small mobile devices
    Given the viewport is "320x568"
    And the app is loaded
    And I have a "500 SC" race in my history with the following events:
      | Lane | Lap | Timestamp |
      | 1    | 2   | 1000      |
      | 2    | 2   | 1100      |
      | 3    | 2   | 1200      |
      | 4    | 2   | 1300      |
      | 5    | 2   | 1400      |
      | 6    | 2   | 1500      |
      | 7    | 2   | 1600      |
      | 8    | 2   | 1700      |
      | 9    | 2   | 1800      |
      | 10   | 2   | 1900      |
    And I am on the "History" screen
    When I click on the first race record
    Then I should see the race details screen
    And for lap 2, the order of finish should be "1, 2, 3, 4, 5, 6, 7, 8, 9, 10"
    And for lap 2, the order of finish should be on a single line without wrapping
    And the lap table should not have horizontal scrolling

  @browser
  Scenario: Vertical scrolling without horizontal overflow for 10-lane races
    Given the viewport is "320x568"
    And the app is loaded
    And I have a "1650 SC" race in my history with the following events:
      | Lane | Lap | Timestamp |
      | 1    | 2   | 1000      |
      | 2    | 2   | 1100      |
      | 3    | 2   | 1200      |
      | 4    | 2   | 1300      |
      | 5    | 2   | 1400      |
      | 6    | 2   | 1500      |
      | 7    | 2   | 1600      |
      | 8    | 2   | 1700      |
      | 9    | 2   | 1800      |
      | 10   | 2   | 1900      |
      | 1    | 66  | 66000     |
    And I am on the "History" screen
    When I click on the first race record
    Then I should see the race details screen
    And the lap table should be vertically scrollable
    And the lap table should not have horizontal scrolling

  @browser
  Scenario: Vertical scrolling with sticky header for long races
    Given the viewport is "320x568"
    And the app is loaded
    And I have a "1650 SC" race in my history with the following events:
      | Lane | Lap | Timestamp |
      | 1    | 2   | 1000      |
      | 1    | 4   | 2000      |
      | 1    | 6   | 3000      |
      | 1    | 8   | 4000      |
      | 1    | 10  | 5000      |
      | 1    | 12  | 6000      |
      | 1    | 14  | 7000      |
      | 1    | 16  | 8000      |
      | 1    | 18  | 9000      |
      | 1    | 20  | 10000     |
      | 1    | 22  | 11000     |
      | 1    | 24  | 12000     |
      | 1    | 26  | 13000     |
      | 1    | 28  | 14000     |
      | 1    | 30  | 15000     |
      | 1    | 32  | 16000     |
      | 1    | 34  | 17000     |
      | 1    | 36  | 18000     |
      | 1    | 38  | 19000     |
      | 1    | 40  | 20000     |
      | 1    | 42  | 21000     |
      | 1    | 44  | 22000     |
      | 1    | 46  | 23000     |
      | 1    | 48  | 24000     |
      | 1    | 50  | 25000     |
      | 1    | 52  | 26000     |
      | 1    | 54  | 27000     |
      | 1    | 56  | 28000     |
      | 1    | 58  | 29000     |
      | 1    | 60  | 30000     |
      | 1    | 62  | 31000     |
      | 1    | 64  | 32000     |
      | 1    | 66  | 33000     |
    And I am on the "History" screen
    When I click on the first race record
    Then I should see the race details screen
    And the lap table should be vertically scrollable
    And the table header should remain fixed during scrolling

  @browser
  Scenario: Navigating back to history
    Given the app is loaded
    And I have completed several races
    And I am on the "History" screen
    When I click on the first race record
    Then I should see the race details screen
    When I click the back button in race details
    Then I should be on the "History" screen
