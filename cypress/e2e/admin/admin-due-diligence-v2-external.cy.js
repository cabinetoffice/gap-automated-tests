import {
  assert200,
  downloadFileFromLink,
  log,
  signInAsAdmin,
  signInToIntegrationSite,
  validateXlsx,
} from "../../common/common";

describe("Downloads and Due Diligence", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("V2 External - Download due diligence data", () => {
    // Populate data instead of completing journey
    log(
      "Admin V2 External - Due Diligence download - inserting submissions, mq and spotlight submissions",
    );
    cy.task("insertSubmissionsAndMQs");

    log("Admin V2 External - Due Diligence download - signing in as admin");
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();

    // View grant and get due diligence data
    log("Admin V2 External - Due Diligence download - viewing grant");
    cy.contains("Cypress - Test Scheme V2 External").click();
    cy.contains(
      ".govuk-button--secondary",
      "Manage due diligence checks",
    ).click();

    // Check download link works
    assert200(cy.get(":nth-child(4) > .govuk-link"));

    log(
      "Admin V2 External - Due Diligence download - downloading due diligence",
    );
    downloadFileFromLink(
      cy.contains("Download due diligence information"),
      "required_checks.xlsx",
    );

    log(
      "Admin V2 External - Due Diligence download - validating due diligence",
    );
    validateXlsx("/cypress/downloads/required_checks.xlsx", [
      [
        Cypress.env("testV1InternalGrant").advertId,
        "V2 External Limited company",
        "addressLine1, addressLine2",
        "city",
        "county",
        "postcode",
        "100",
        "67890",
        "12345",
        "Limited company",
        "",
      ],
    ]);
  });
});
