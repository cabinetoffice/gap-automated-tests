import {
  SUPER_ADMIN_DASHBOARD_URL,
  assert200,
  assert404,
  clickBack,
  clickSaveAndContinue,
  clickText,
  downloadFileFromLink,
  searchForGrant,
  log,
  saveAndExit,
  signInAsAdmin,
  signInAsApplyApplicant,
  signInAsSuperAdmin,
  signInToIntegrationSite,
  signOut,
  validateXlsx,
} from "../../common/common";
import { GRANT_NAME, SPOTLIGHT_SUBMISSION_STATUS, TASKS } from "./constants";
import {
  advertSection1,
  advertSection2,
  advertSection3,
  advertSection4,
  advertSection5,
  applicationForm,
  convertDateToString,
  validateSubmissionDownload,
  createGrant,
  publishAdvert,
  publishApplicationForm,
} from "./helper";

import {
  equalitySectionDecline,
  fillOutCustomSection,
  fillOutEligibity,
  fillOutRequiredChecks,
  submitApplication,
} from "../applicant/helper";

import fs from "fs";

const {
  UPDATE_SPOTLIGHT_SUBMISSION_STATUS,
  ADD_SPOTLIGHT_BATCH,
  ADD_SUBMISSION_TO_MOST_RECENT_BATCH,
  CLEANUP_TEST_SPOTLIGHT_SUBMISSIONS,
} = TASKS;

const { SENT, SEND_ERROR, GGIS_ERROR, VALIDATION_ERROR } =
  SPOTLIGHT_SUBMISSION_STATUS;

describe("Create a Grant", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it.only("V1 Internal - Download Due Diligence Data", () => {
    // Populate data instead of completing journey
    log(
      "Admin V1 Internal - Download Due Diligence - inserting submissions, mq and spotlight submissions",
    );
    cy.task("insertSubmissionsAndMQs");

    log("Admin V1 Internal - Download Due Diligence - signing in as admin");
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();

    // View V1 internal grant
    log("Admin V1 Internal - Download Due Diligence - viewing grant");
    cy.get('[data-cy="cy_SchemeListButton"]').click();
    cy.get(
      '[data-cy="cy_linkToScheme_Cypress - Test Scheme V1 Internal"]',
    ).click();

    // Check download link works
    assert200(
      cy.get(
        '[data-cy="cy_Scheme-details-page-button-Download required checks"]',
      ),
    );

    log(
      "Admin V1 Internal - Download Due Diligence - downloading required checks",
    );
    downloadFileFromLink(
      cy.contains("Download required checks"),
      "required_checks.xlsx",
    );

    log(
      "Admin V1 Internal - Download Due Diligence - validating required checks",
    );
    validateXlsx("/cypress/downloads/required_checks.xlsx", [
      [
        Cypress.env("testV1InternalGrant").advertId,
        "V1 Internal Limited company",
        "Address line 1, Address line 2",
        "Town",
        "County",
        "Postcode",
        "100",
        "",
        "",
        "",
      ],
    ]);

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
    cy.task("listDir", "/cypress/downloads/unzip/submission_export").then(
      (files) => {
        cy.log("WE ARE LOGGING");
        cy.log(JSON.stringify(Object.entries(files)));
      },
    );

    validateSubmissionDownload(Cypress.env("testV1InternalGrant").schemeId);
    cy.readFile(
      "cypress/downloads/unzip/submission_export/V1_Internal_Limited_company_00000050_0000_0000_000_1.odt",
    );
  });

  it.only("V1 Internal - Download Submission Export", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

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
    cy.task("listDir", "/cypress/downloads/unzip/submission_export").then(
      (files) => {
        cy.log("WE ARE LOGGING");
        cy.log(JSON.stringify(Object.entries(files)));
      },
    );
    validateSubmissionDownload(Cypress.env("testV1InternalGrant").schemeId);

    cy.readFile("cypress/downloads/unzip/submission_export/example_1.doc");
  });
});
