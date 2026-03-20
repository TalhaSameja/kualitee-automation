@login
Feature: User Authentication
  As a user
  I want to log in to the Kualitee application
  So that I can access my dashboard

  @valid @smoke
  Scenario: Successful Login with Valid Credentials
    Given I am on the login page
    When I login with valid credentials
    Then I should be redirected to the dashboard page

  @invalid @regression
  Scenario: Failed Login with Invalid Credentials
    Given I am on the login page
    When I login with invalid credentials
    Then I should see an error message  