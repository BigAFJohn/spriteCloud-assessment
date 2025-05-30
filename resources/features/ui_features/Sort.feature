@ui-test
Feature: Sort Items

  Scenario: Validate Z-A sorting by item name
    Given the user access to Sauce Demo
    And the user logs in with STANDARD_USER credentials
    When the user selects sorting option "Name (Z to A)"
    Then the products should be sorted in descending alphabetical order
