@testcase
Feature: Test Case Management
  As a QA Engineer
  I want to create test cases using standard datasets
  So that I can ensure data consistency

  Background:
    Given I am logged in to the application

  Scenario: Create a Smoke Test Case
    When I navigate to the Test Management module
    And I create a "smokeTest" test case
    Then the test case should be created successfully
    