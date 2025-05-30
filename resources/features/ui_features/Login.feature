@ui-test
Feature: Login Functionality

  Scenario Outline: Validate error messages for invalid login attempts
  Given the user access to Sauce Demo
  When the user attempts to log in with "<typeofUser>" credentials
  Then 2 error icons and the error message for "<typeofUser>" should be displayed

  Examples:
    | typeofUser        |
    | NON_EXISTING_USER |
    | BLOCKED_USER      |

