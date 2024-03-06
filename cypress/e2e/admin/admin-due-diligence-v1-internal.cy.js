import {
  log,
  signInAsAdmin,
  signInToIntegrationSite,
  downloadFileFromLink,
} from "../../common/common";
import { submissionExportSuccess } from "./helper";

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
      "Admin V1 Internal - Download Submission Export - Validating downloaded submission export",
    );

    submissionExportSuccess(Cypress.env("testV1InternalGrant"), 1);
  });

  it.skip("V1 Internal - Error in Export", () => {
    // Before each stuff

    cy.contains("Your grant has 0 applications available to download.");
    cy.contains(
      "Your grant has 1 application that cannot be downloaded. You can still view a read-only version of these applications.",
    );
    cy.contains("My First Org");
    cy.get(".govuk-link").contains("View").click();

    cy.contains(Cypress.env("testV1InternalGrant").schemeName);
    cy.contains("Eligibility");
    cy.contains("Required checks");
    cy.contains("Custom Section");
    downloadFileFromLink(
      cy.get(".govuk-body > .govuk-link"),
      "GAP-SAN-20240305-142--122%2Fattachments.zip",
    );
  });
});
