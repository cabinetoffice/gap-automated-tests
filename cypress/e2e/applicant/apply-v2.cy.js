import {
  clickSaveAndContinue,
  signInToIntegrationSite,
  searchForGrant,
  signInAsApplyApplicant,
  clickText,
  log,
} from "../../common/common";
import {
  fillOutEligibity,
  submitApplication,
  equalitySectionAccept,
  equalitySectionDecline,
  fillOrgProfile,
  partialFillOrgProfile,
  editDetailsOnSummaryScreen,
  confirmDetailsOnSummaryScreen,
  confirmOrgAndFundingDetails,
  fillMqOrgQuestionsAsLimitedCompany,
  fillMqFunding,
  validateMqNonLimitedJourney,
  validateMqIndividualJourney,
  validateMqIndividualSummaryScreen,
  editOrgTypeToNonLimitedCompany,
  validateMqNonLimitedSummaryScreen,
  editOrgTypeToLimitedCompany,
  validateMqLimitedCompanySummaryScreen,
  editOrgDetails,
  editFundingDetails,
  validateOrgDetailsForNonLimitedCompany,
  validateOrgDetailsForIndividual,
  validateOrgDetailsForCharity,
} from "./helper";

// Details object
const MQ_DETAILS = {
  name: "MyOrg",
  address: ["addressLine1", "addressLine2", "city", "county", "postcod"],
  orgType: "Limited company",
  companiesHouse: "12345",
  charitiesCommission: "67890",
  howMuchFunding: "100",
  fundingLocation: [
    "North East (England)",
    "North West (England)",
    "Yorkshire and the Humber",
    "East Midlands (England)",
    "West Midlands (England)",
    "London",
    "South East (England)",
    "South West (England)",
    "Scotland",
    "Wales",
    "Northern Ireland",
    "Outside of the UK",
  ],
};

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

    // Go back to Org Type, change to Individual and check that Companies House and Charity Commission are skipped and that copy is changed
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
    confirmDetailsOnSummaryScreen(MQ_DETAILS);

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
      "Apply V2 Internal MQ Partial - Validating Org Details for Non-Limited Company",
    );
    validateOrgDetailsForNonLimitedCompany();
    log("Apply V2 Internal MQ Partial - Validating Org Details for Individual");
    validateOrgDetailsForIndividual();
    log(
      "Apply V2 Internal MQ Partial - Validating MQ summary screen for Charity",
    );
    validateOrgDetailsForCharity();

    // Confirm Org & Funding Details and Submit
    confirmOrgAndFundingDetails(
      "1",
      "Charity",
      ["North East (England)"],
      MQ_DETAILS,
    );
    log("Apply V2 Internal MQ Partial - Submitting application");
    submitApplication();

    // Fill E&D Questions and return to dashboard
    log("Apply V2 Internal MQ Partial - Filling out equality section");
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

  it("Mandatory Questions Flow - Partially Filled Org Profile", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

    // Sign in
    log("Apply V2 Internal MQ Partial - Logging in as applicant");
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant();

    /*
    Test Coverage:
    - Internal Application
    - Partially Filled Org Profile
    - Edit on Org Details and Funding Details
    - Skip E&D Questions
    */

    // Partially fill org profile
    log("Apply V2 Internal MQ Partial - Partially filling org profile");
    partialFillOrgProfile(MQ_DETAILS);

    // Search & Start new application
    log("Apply V2 Internal MQ Partial - Searching for application");
    cy.get('[data-cy="cySearch grantsPageLink"] > .govuk-link').click();
    cy.get('[data-cy="cySearchAgainInput"]').type(
      Cypress.env("testV2InternalGrant").advertName,
    );
    cy.get('[data-cy="cySearchAgainButton"]').click();

    log(
      "Apply V2 Internal MQ Partial - Beginning application for V2 Internal grant",
    );
    cy.contains(Cypress.env("testV2InternalGrant").advertName).click();
    cy.contains("Start new application").invoke("removeAttr", "target").click();

    // Before you start
    log(
      "Apply V2 Internal MQ Partial - Beginning MQ flow for V2 Internal Partial",
    );
    cy.contains("Before you start");
    cy.contains("Continue").click();

    // Org Type - should be filled

    log("Apply V2 Internal MQ Partial - MQ Org Type Limited Company");
    cy.get('[data-cy="cy-radioInput-option-LimitedCompany"]').should(
      "be.checked",
    );
    clickSaveAndContinue();

    // Name - Should be empty
    log("Apply V2 Internal MQ Partial - MQ Name");
    cy.get('[data-cy="cy-name-text-input"]')
      .should("be.empty")
      .type(MQ_DETAILS.name);
    clickSaveAndContinue();

    // Address - should be full
    log("Apply V2 Internal MQ Partial - MQ Address");
    ["addressLine1", "addressLine2", "city", "county", "postcode"].forEach(
      (item, index) => {
        cy.get(`[data-cy="cy-${item}-text-input"]`).should(
          "have.value",
          MQ_DETAILS.address[index],
        );
      },
    );
    clickSaveAndContinue();

    // Companies House - should be empty
    log("Apply V2 Internal MQ Partial - MQ Companies House");
    cy.get('[data-cy="cy-companiesHouseNumber-text-input"]')
      .should("be.empty")
      .type(MQ_DETAILS.companiesHouse);
    clickSaveAndContinue();

    // Charities Commission - Should be filled
    log("Apply V2 Internal MQ Partial - MQ Charity Commission");
    cy.get('[data-cy="cy-charityCommissionNumber-text-input"]').should(
      "have.value",
      MQ_DETAILS.charitiesCommission,
    );
    clickSaveAndContinue();

    // Complete rest of MQ journey
    log("Apply V2 Internal MQ Partial - MQ Funding");
    fillMqFunding(MQ_DETAILS);
    log("Apply V2 Internal MQ Partial - MQ Summary");
    confirmDetailsOnSummaryScreen(MQ_DETAILS);
    log("Apply V2 Internal MQ Partial - Submit MQ");
    clickText("Confirm and submit");

    cy.get('[data-cy="cyAccount detailsPageLink"] > .govuk-link').click();
    cy.get('[data-cy="cy-link-card-Your saved information"]').click();

    log("Apply V2 Internal MQ Partial - Checking profile org type");
    cy.get('[data-cy="cy-organisation-value-Type of organisation"]').contains(
      MQ_DETAILS.orgType,
    );
    log("Apply V2 Internal MQ Partial - Checking profile address");
    cy.get("[data-cy=cy-organisation-value-Address]")
      .find("ul")
      .children("li")
      .each((listItem, index) => {
        cy.wrap(listItem).contains(
          MQ_DETAILS.address[index] + (index < 4 ? "," : ""),
        );
      });

    log("Apply V2 Internal MQ Partial - Checking profile Companies House");
    // y.get('[data-cy="cy-organisation-value-Companies House number"]').contains(
    cy.get('[data-cy="cy-organisation-value-Companies house number"]').contains(
      MQ_DETAILS.companiesHouse,
    );
    log("Apply V2 Internal MQ Partial - Checking profile Charity Commission");
    cy.get(
      '[data-cy="cy-organisation-value-Charity commission number"]',
      // '[data-cy="cy-organisation-value-Charity Commission number"]',
    ).contains(MQ_DETAILS.charitiesCommission);

    cy.get('[data-cy="cy-back-to-dashboard-button"]').click();

    log("Apply V2 Internal MQ Partial - Navigate to application");
    cy.get('[data-cy="cy-your-applications-link"]').click();
    cy.get(
      '[data-cy="cy-application-link-Cypress - Test Application V2 Internal"]',
    ).click();

    // Complete & Submit application
    log("Apply V2 Internal MQ Partial - Fill out Eligibility");
    fillOutEligibity();
    log("Apply V2 Internal MQ Partial - Edit Org Details");
    editOrgDetails(MQ_DETAILS);
    log("Apply V2 Internal MQ Partial - Edit Funding Details");
    editFundingDetails(MQ_DETAILS);

    // Submit & skip E&D questions and return to dashboard
    log("Apply V2 Internal MQ Partial - Submitting application");
    submitApplication();
    equalitySectionDecline();
    clickText("View your applications");
    clickText("Back");
  });
});
