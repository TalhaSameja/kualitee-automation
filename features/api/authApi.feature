@api @auth
Feature: API Authentication
  As a consuming application
  I want to interact with the authentication API
  So that I can receive a valid token

  @valid @smoke
  Scenario: Successful API Login
    Given I want to authenticate via the API
    When I send a valid payload to the login endpoint
    Then the API should respond with status code 200
    And the response should contain a token

  @invalid @negative
  Scenario Outline: API Login with Invalid Credentials
    Given I want to authenticate via the API
    When I send a payload with email "<email>" and password "<password>"
    Then the API should respond with status code 400
    And the response should contain an error message

    Examples:
      | email     | password      |
      | wronguser | wrongpassword |
