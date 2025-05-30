# resources/features/api_features/Api.feature
@api-test
Feature: User API operations

  Background:
    Given the API base URL is set

  Scenario: Retrieve a list of users on page 2
    When a GET request is sent to "/api/users?page=2"
    Then the response status should be 200
    And the response should contain a list of users

  Scenario: Perform a successful login
    When a POST request is sent to "api/login" with body:
      """
      {
        "email": "eve.holt@reqres.in",
        "password": "cityslicka"
      }
      """
    Then the response status should be 200
    And the response should contain a valid authentication token

  Scenario: Perform an update for user with ID 2
    When a PUT request is sent to "api/users/2" with body:
      """
      {
        "name": "morpheus",
        "job": "zion resident"
      }
      """
    Then the response status should be 200
    And the response should contain updated user details

  Scenario: Perform a deletion for user with ID 2
    When a DELETE request is sent to "api/users/2"
    Then the response status should be 204

  Scenario Outline: Negative login tests
    When a POST request is sent to "api/login" with body:
      """
      {
        "email": "<email>",
        "password": "<password>"
      }
      """
    Then the response status should be 400
    And the response should contain error message "<errorMessage>"

    Examples:
      | email        | password | errorMessage              |
      | peter@klaven |          | Missing password          |
      |              | password | Missing email or username |

  Scenario Outline: Parameterized delayed request
    When a GET request is sent to "api/users?delay=<delaySeconds>"
    Then the response status should be 200
    And the response time should be less than or equal to <delaySeconds> seconds

    Examples:
      | delaySeconds |
      | 1            |
      | 2            |
      | 3            |