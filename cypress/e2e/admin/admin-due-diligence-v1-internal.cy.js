import {
  searchForGrant,
  log,
  signInAsAdmin,
  signInAsApplyApplicant,
  signInToIntegrationSite,
  signOut,
} from "../../common/common";
import { validateSubmissionDownload } from "./helper";

import {
  equalitySectionDecline,
  fillOutCustomSection,
  fillOutEligibity,
  fillOutRequiredChecks,
  submitApplication,
} from "../../common/apply-helper";

describe("Downloads and Due Diligence", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it.skip("V1 Internal - Download Submission Export", () => {
    cy.task("publishGrantsToContentful");

    // Sign in and complete application as applicant
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    log(
      "Admin V1 Internal - Download Submission Export - Signing in as applicant",
    );
    signInAsApplyApplicant();

    // Search & Start internal application
    log(
      "Admin V1 Internal - Download Submission Export - Searching for and starting application",
    );
    cy.get('[data-cy="cy-find-a-grant-link"]').click();
    searchForGrant(Cypress.env("testV1InternalGrant").advertName);
    cy.contains(Cypress.env("testV1InternalGrant").advertName).click();
    cy.contains("Start new application").invoke("removeAttr", "target").click();

    // Complete application
    log(
      "Admin V1 Internal - Download Submission Export - Filling out Eligibility",
    );
    fillOutEligibity();
    log(
      "Admin V1 Internal - Download Submission Export - Filling out Required Checks",
    );
    fillOutRequiredChecks();
    log(
      "Admin V1 Internal - Download Submission Export - Filling out Custom Section with Doc upload",
    );
    fillOutCustomSection();
    log(
      "Admin V1 Internal - Download Submission Export - Submitting application",
    );
    cy.contains("Review and submit").click();
    submitApplication();
    log(
      "Admin V1 Internal - Download Submission Export - Declining Equality Section",
    );
    equalitySectionDecline();

    // Sign in as admin
    log(
      "Admin V1 Internal - Download Submission Export - Signing out as applicant",
    );
    signOut();

    log("Admin V1 Internal - Download Submission Export - signing in as admin");
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();

    // View V1 internal grant
    log("Admin V1 Internal - Download Submission Export - viewing grant");
    cy.get('[data-cy="cy_SchemeListButton"]').click();
    cy.get(
      '[data-cy="cy_linkToScheme_Cypress - Test Scheme V1 Internal"]',
    ).click();
    log(
      "Admin V1 Internal - Download Submission Export - Initiating download of submission export",
    );
    cy.get(
      '[data-cy="cy_Scheme-details-page-button-View submitted application"]',
    ).click();

    cy.get('[data-cy="cy-button-Download submitted applications"]').click();

    cy.contains("A list of applications is being created");

    log(
      "Admin V1 Internal - Download Submission Export - Waiting for submission export lambda to execute",
    );
    cy.wait(10000);

    log(
      "Admin V1 Internal - Download Submission Export - Validating downloaded submission export",
    );
    validateSubmissionDownload(Cypress.env("testV1InternalGrant").schemeId, 2);
    cy.readFile("cypress/downloads/unzip/submission_export/example_1.doc");
  });
});
