import {
  signInToIntegrationSite,
  searchForGrant,
  signInAsApplyApplicant,
  clickText,
  log,
} from "../../common/common";
import {
  equalitySectionAccept,
  fillOrgProfile,
  editDetailsOnSummaryScreen,
  confirmDetailsOnSummaryScreen,
  confirmOrgAndFundingDetails,
  validateMqNonLimitedJourney,
  validateMqIndividualJourney,
  validateMqIndividualSummaryScreen,
  editOrgTypeToNonLimitedCompany,
  validateMqNonLimitedSummaryScreen,
  editOrgTypeToLimitedCompany,
  validateMqLimitedCompanySummaryScreen,
  validateOrgDetailsForNonLimitedCompany,
  validateOrgDetailsForIndividual,
  validateOrgDetailsForCharity,
} from "./helper";
import {
  fillMqFunding,
  fillMqOrgQuestionsAsLimitedCompany,
  fillOutEligibity,
  submitApplication,
} from "../../common/apply-helper";
import { MQ_DETAILS } from "../../common/constants";

describe("Apply for a Grant V2", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Mandatory Questions Flow - Empty & Filled Organisation Profile", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

    log("Apply V2 Internal MQ Empty - Signing in as applicant");
    // Sign in
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant();

    // 1. EMPTY ORG PROFILE
    /*
    Test Coverage:
    - Internal Application
    - Empty Org Profile
    - Complete E&D Questions
    */
    // Search & Start internal application
    log("Apply V2 Internal MQ Empty - Running empty org profile journey");
    cy.get('[data-cy="cy-find-a-grant-link"]').click();
    searchForGrant(Cypress.env("testV2InternalGrant").advertName);
    cy.contains(Cypress.env("testV2InternalGrant").advertName).click();
    cy.contains("Start new application").invoke("removeAttr", "target").click();

    // Before you start
    cy.contains("Before you start");
    cy.contains("Continue").click();

    // Mandatory Questions & Confirm Details
    log("Apply V2 Internal MQ Empty - Filling out MQ as Limited Company");
    fillMqOrgQuestionsAsLimitedCompany(MQ_DETAILS);

    // Check journeys are valid for Non-Limited Company and Individual

    // Go back to Org Type, change to Non-Limited Company and check that Companies House and Charity Commission are skipped
    log("Apply V2 Internal MQ Empty - Filling out MQ as Non-Limited Company");
    validateMqNonLimitedJourney();

    // Go back to Org Type, change to Individual (this will set the CCN and CHN to null) and check that Companies House and Charity Commission are skipped and that copy is changed
    log("Apply V2 Internal MQ Empty - Filling out MQ as Individual");
    validateMqIndividualJourney();

    log("Apply V2 Internal MQ Empty - Filling out MQ funding");
    fillMqFunding(MQ_DETAILS);

    log(
      "Apply V2 Internal MQ Empty - Validating MQ summary screen for Individual",
    );
    validateMqIndividualSummaryScreen();

    // Edit Org Type to Non-Limited Company and check that Summary screen is correct
    log(
      "Apply V2 Internal MQ Empty - Validating MQ summary screen for Non-Limited Company",
    );
    editOrgTypeToNonLimitedCompany();
    validateMqNonLimitedSummaryScreen();

    // Edit Org Type to Limited Company and check that Summary screen is correct
    log(
      "Apply V2 Internal MQ Empty - Validating MQ summary screen for Limited Company",
    );
    editOrgTypeToLimitedCompany();
    validateMqLimitedCompanySummaryScreen();

    cy.contains("Confirm your details");
    // because previously we selected Individual, CHN and CCN are null so it will show the -
    confirmDetailsOnSummaryScreen(MQ_DETAILS, true);

    // Click through and edit fields
    log("Apply V2 Internal MQ Empty - Editing details from summary screen");
    editDetailsOnSummaryScreen(MQ_DETAILS);

    // Confirm and submit mandatory questions
    log("Apply V2 Internal MQ Empty - Submitting MQ");
    clickText("Confirm and submit");

    // Check page is loaded
    cy.get(
      '[data-cy="cy-application-name-Cypress - Test Application V2 Internal"]',
    ).should("exist");
    cy.get('[data-cy="cy-application-header"]').should("exist");

    // Check status of tasks - Pre Eligibility
    cy.get('[data-cy="cy-status-tag-Eligibility-Not Started"]').should("exist");
    cy.get(
      '[data-cy="cy-status-tag-Your organisation-Cannot Start Yet"]',
    ).should("exist");
    cy.get('[data-cy="cy-status-tag-Funding-Cannot Start Yet"]').should(
      "exist",
    );

    log("Apply V2 Internal MQ Empty - Filling out Eligibility");
    fillOutEligibity();

    // Check status of tasks - Post Eligibility
    cy.get('[data-cy="cy-status-tag-Eligibility-Completed"]').should("exist");
    cy.get('[data-cy="cy-status-tag-Your organisation-In Progress"]').should(
      "exist",
    );
    cy.get('[data-cy="cy-status-tag-Funding-In Progress"]').should("exist");

    log(
      "Apply V2 Internal MQ Empty - Validating Org Details for Non-Limited Company",
    );
    validateOrgDetailsForNonLimitedCompany();
    log("Apply V2 Internal MQ Empty - Validating Org Details for Individual");
    validateOrgDetailsForIndividual();
    log(
      "Apply V2 Internal MQ Empty - Validating MQ summary screen for Charity",
    );
    // because previously we selected Individual, CHN and CCN are null so it will show the -
    validateOrgDetailsForCharity();

    // Confirm Org & Funding Details and Submit
    confirmOrgAndFundingDetails(
      "1",
      "Charity",
      ["North East (England)"],
      MQ_DETAILS,
      true,
    );

    log("Apply V2 Internal MQ Empty - Reviewing submission");
    cy.contains("Review and submit").click();

    log("Apply V2 Internal MQ Empty - Submitting application");
    submitApplication();

    // Fill E&D Questions and return to dashboard
    log("Apply V2 Internal MQ Empty - Filling out equality section");
    equalitySectionAccept();
    clickText("View your applications");
    clickText("Back");

    // 2. FILLED ORG PROFILE
    /*
    Test Coverage:
    - External Application
    - Full Org Profile
    */

    log("Apply V2 External MQ Filled - MQ Filled Org Profile journey");

    // Refill Org Profile
    log("Apply V2 External MQ Filled - Filling out Org Profile");
    fillOrgProfile(MQ_DETAILS);

    // Search & Start external application
    log("Apply V2 External MQ Filled - Search for external application");
    cy.get('[data-cy="cySearch grantsPageLink"] > .govuk-link').click();
    cy.get('[data-cy="cySearchAgainInput"]').type(
      Cypress.env("testV2ExternalGrant").advertName,
    );
    cy.get('[data-cy="cySearchAgainButton"]').click();

    cy.contains(Cypress.env("testV2ExternalGrant").advertName).click();
    cy.contains("Start new application").invoke("removeAttr", "target").click();

    // Mandatory Questions Journey - Straight to Funding Details
    log(
      "Apply V2 External MQ Filled - Beginning MQ external flow for filled profile",
    );
    cy.contains("Before you start");
    cy.contains("Continue").click();

    fillMqFunding(MQ_DETAILS);

    log("Apply V2 External MQ Filled - Confirming details on summary screen");
    confirmDetailsOnSummaryScreen(MQ_DETAILS);

    log("Apply V2 External MQ Filled - Submitting MQ");
    // Confirm and submit application
    clickText("Confirm and submit");

    // Now leaving page
    log("Apply V2 External MQ Filled - Exiting to external application form");
    cy.contains("You are now leaving GOV.UK");
    cy.get('[data-cy="cy-apply-external-application-button"]')
      .invoke("attr", "href")
      .should("eq", Cypress.env("testV2ExternalGrant").applicationUrl);
    clickText("Continue to application form");
  });
});
