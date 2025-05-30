@ui-test
Feature: Checkout Flow

  Background:
    Given the user access to Sauce Demo

  Scenario Outline: Validate successful checkout with multiple products
    And the user logs in with <userType> credentials
    When the user add first <productCount> products to cart
    And click on the cart icon
    And the user click on checkout button
    And the user fills the personal information form with valid details
    When the user click on finish button
    Then the purchase was completed with a success message and green check

    Examples:
      | userType       | productCount |
      | STANDARD_USER  | 2            |
