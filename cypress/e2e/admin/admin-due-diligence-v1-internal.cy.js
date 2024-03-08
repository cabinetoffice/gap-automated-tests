import {
  log,
  searchForGrant,
  signInAsAdmin,
  signInToIntegrationSite,
} from "../../common/common";
import { submissionExportSuccess } from "./helper";

const EXPORT_BATCH = Cypress.env("exportBatch");

describe("Downloads and Due Diligence", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("V1 Internal - Download Submission Export", () => {
    // Publish grants and insert submissions
    cy.task("publishGrantsToContentful");
    cy.task("insertSubmissionsAndMQs");

    log("Admin V1 Internal - Download Submission Export - signing in as admin");
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();
    cy.visit("/apply/admin/dashboard");

    // View V1 internal grant
    log("Admin V1 Internal - Download Submission Export - viewing grant");

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
      "Admin V1 Internal - Download Submission Export - Validating downloaded submission export",
    );

    submissionExportSuccess(Cypress.env("testV1InternalGrant"), 1);
  });

  it("Error in Export", () => {
    // Sign in as admin
    log("Admin V1 Internal - Download Submission Export - signing in as admin");
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();
    cy.visit("/apply/admin/dashboard");

    // Insert failing submission and export and visit main download page
    cy.task("insertSubmissionAndExport");
    cy.visit(
      `apply/admin/scheme/${Cypress.env("testV1InternalGrant").schemeId}/${
        EXPORT_BATCH.export_batch_id_v1
      }`,
    );
    cy.contains(Cypress.env("testV1InternalGrant").schemeName);
    cy.contains("Cannot download 1 application");
    cy.contains("V1 Internal Limited company");

    // View failed export
    cy.get(".govuk-link").contains("View").click();
    cy.contains(Cypress.env("testV1InternalGrant").schemeName);
    cy.contains("Eligibility");
    cy.contains("Required checks");
    cy.contains("Custom Section");
    cy.contains(
      "download a copy of any files attached to this application (ZIP)",
    );

    // Return to main page
    cy.get(".govuk-button").click();
    cy.contains(Cypress.env("testV1InternalGrant").schemeName);
    cy.contains("Cannot download 1 application");
    cy.contains("V1 Internal Limited company");
  });
});
