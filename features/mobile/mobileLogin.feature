@mobile @login
Feature: Mobile User Authentication
  As a mobile user
  I want to log in to the Kualitee application via mobile browser
  So that I can access my dashboard

  @valid @smoke
  Scenario: Successful Mobile Login with Valid Credentials
    Given I am on the mobile login page
    When I login on mobile with valid credentials
    Then I should be redirected to the mobile dashboard page
