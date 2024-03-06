import {
  assert200,
  clickBack,
  clickSaveAndContinue,
  clickText,
  downloadFileFromLink,
  log,
  signInAsAdmin,
  signInToIntegrationSite,
  validateXlsx,
} from "../../common/common";
import { SPOTLIGHT_SUBMISSION_STATUS, TASKS } from "./constants";
import { convertDateToString, submissionExportSuccess } from "./helper";

import { EXPORT_BATCH } from "../../common/constants";

const {
  UPDATE_SPOTLIGHT_SUBMISSION_STATUS,
  ADD_SPOTLIGHT_BATCH,
  ADD_SUBMISSION_TO_MOST_RECENT_BATCH,
  CLEANUP_TEST_SPOTLIGHT_SUBMISSIONS,
} = TASKS;

const { SENT, SEND_ERROR, GGIS_ERROR, VALIDATION_ERROR } =
  SPOTLIGHT_SUBMISSION_STATUS;

describe("Downloads and Due Diligence", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Can access and use 'Manage Due Diligence Checks' (spotlight)", () => {
    // Populate data instead of completing journey
    log(
      "Admin V2 Internal - Manage Due Diligence & Spotlight - inserting submissions, mq and spotlight submissions",
    );
    cy.task("insertSubmissionsAndMQs");

    cy.task(UPDATE_SPOTLIGHT_SUBMISSION_STATUS, SENT);

    log(
      "Admin V2 Internal - Manage Due Diligence & Spotlight - signing in as admin",
    );
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();

    log("Admin V2 Internal - Manage Due Diligence & Spotlight - viewing grant");
    cy.get('[data-cy="cy_SchemeListButton"]').click();
    cy.get(
      "[data-cy='cy_linkToScheme_Cypress - Test Scheme V2 Internal']",
    ).click();

    clickText("Manage due diligence checks");

    // due diligence downloads
    assert200(cy.get(":nth-child(4) > .govuk-link"));
    assert200(cy.get(":nth-child(6) > .govuk-link"));

    log(
      "Admin V2 Internal - Manage Due Diligence & Spotlight - downloading Spotlight checks",
    );
    downloadFileFromLink(
      cy.contains("download the information you need to run checks"),
      "spotlight_checks.zip",
    );

    log(
      "Admin V2 Internal - Manage Due Diligence & Spotlight - unzipping Spotlight checks",
    );
    cy.unzip({ path: "cypress/downloads/", file: "spotlight_checks.zip" });

    log(
      "Admin V2 Internal - Manage Due Diligence & Spotlight - validating Spotlight checks",
    );
    const timestamp = convertDateToString(Date.now());
    const filePath = "/cypress/downloads/unzip/spotlight_checks";

    const limitedCompanyFileName = `${filePath}/${timestamp}_GGIS_ID_2_Cypress__Test_Scheme_V2_Internal_charities_and_companies_1.xlsx`;
    validateXlsx(limitedCompanyFileName, [
      [
        Cypress.env("testV2InternalGrant").advertId,
        "V2 Internal Limited company",
        "addressLine1, addressLine2",
        "city",
        "county",
        "postcode",
        "100",
        "67890",
        "12345",
        "",
      ],
    ]);

    const nonLimitedCompanyFileName = `${filePath}/${timestamp}_GGIS_ID_2_Cypress__Test_Scheme_V2_Internal_non_limited_companies_1.xlsx`;
    validateXlsx(nonLimitedCompanyFileName, [
      [
        Cypress.env("testV2ExternalGrant").advertId,
        "V2 Internal Non-limited company",
        "addressLine1, addressLine2",
        "city",
        "county",
        "postcode",
        "100",
        "",
        "",
        "",
      ],
    ]);

    log(
      "Admin V2 Internal - Manage Due Diligence & Spotlight - downloading due diligence",
    );
    downloadFileFromLink(
      cy.contains("Download checks from applications"),
      "required_checks.xlsx",
    );

    log(
      "Admin V2 Internal - Manage Due Diligence & Spotlight - validating due diligence",
    );
    validateXlsx("/cypress/downloads/required_checks.xlsx", [
      [
        Cypress.env("testV2InternalGrant").advertId,
        "V2 Internal Limited company",
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
      [
        Cypress.env("testV2ExternalGrant").advertId,
        "V2 Internal Non-limited company",
        "addressLine1, addressLine2",
        "city",
        "county",
        "postcode",
        "100",
        "",
        "",
        "Non-limited company",
        "",
      ],
      [
        Cypress.env("testV1ExternalGrant").advertId,
        "V2 Internal Individual",
        "addressLine1, addressLine2",
        "city",
        "county",
        "postcode",
        "100",
        "",
        "",
        "I am applying as an Individual",
        "",
      ],
    ]);

    cy.contains("You have 2 applications in Spotlight.");

    // Check error message
    log(
      "Admin V2 Internal - Manage Due Diligence & Spotlight - validating spotlight error messages",
    );
    clickBack();

    cy.task(UPDATE_SPOTLIGHT_SUBMISSION_STATUS, GGIS_ERROR);

    cy.task(ADD_SPOTLIGHT_BATCH);
    cy.task(ADD_SUBMISSION_TO_MOST_RECENT_BATCH);

    clickText("Manage due diligence checks");

    log(
      "Admin V2 Internal - Manage Due Diligence & Spotlight - validating invalid GGIS# spotlight error messages",
    );
    cy.contains(
      "Spotlight did not recognise the GGIS reference number for your grant.",
    );

    clickText("Check that your grant reference number is correct.");

    cy.get('[data-cy="cy-ggisReference-text-input"]').clear();

    cy.get('[data-cy="cy-ggisReference-text-input"]').type("GGIS_ID_NEW");

    clickSaveAndContinue();

    cy.get(
      '[data-cy="cy_summaryListValue_GGIS Scheme Reference Number"]',
    ).contains("GGIS_ID_NEW");

    log(
      "Admin V2 Internal - Manage Due Diligence & Spotlight - validating spotlight service outage error messages",
    );
    cy.task(UPDATE_SPOTLIGHT_SUBMISSION_STATUS, SEND_ERROR);
    clickText("Manage due diligence checks");
    cy.contains(
      "Due to a service outage, we cannot automatically send data to Spotlight at the moment. This affects 2 of your records.",
    );
    clickBack();
    cy.task(UPDATE_SPOTLIGHT_SUBMISSION_STATUS, VALIDATION_ERROR);
    clickText("Manage due diligence checks");
    cy.debug();
    cy.contains("We can't send your data to Spotlight");
    cy.task(CLEANUP_TEST_SPOTLIGHT_SUBMISSIONS);

    // Download submission export

    clickBack();

    log(
      "Admin V2 Internal - Manage Due Diligence & Spotlight - Initiating download of submission export",
    );
    cy.get(
      '[data-cy="cy_Scheme-details-page-button-View submitted application"]',
    ).click();

    cy.get('[data-cy="cy-button-Download submitted applications"]').click();

    cy.contains("A list of applications is being created");

    log(
      "Admin V2 Internal - Manage Due Diligence & Spotlight - Waiting for submission export lambda to execute",
    );

    log(
      "Admin V2 Internal - Manage Due Diligence & Spotlight - Validating downloaded submission export",
    );

    log("Admin V2 Internal - Wait to allow submissions export to process");
    cy.wait(10000);

    submissionExportSuccess(Cypress.env("testV2InternalGrant"), 2);
  });

  it("Error in Export", () => {
    // Sign in as admin
    log("Admin V2 Internal - Download Submission Export - signing in as admin");
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();
    cy.visit("/apply/admin/dashboard");

    // Insert failing submission and export and visit main download page
    cy.task("insertSubmissionAndExport");
    cy.visit(
      `apply/admin/scheme/${Cypress.env("testV2InternalGrant").schemeId}/${
        EXPORT_BATCH.export_batch_id_v2
      }`,
    );
    cy.contains(Cypress.env("testV2InternalGrant").schemeName);
    cy.contains("Cannot download 1 application");
    cy.contains("V2 Limited Company");

    // View failed export
    cy.get(".govuk-link").contains("View").click();
    cy.contains(Cypress.env("testV2InternalGrant").schemeName);
    cy.contains("Eligibility");
    cy.contains("Your organisation");
    cy.contains("Funding");
    cy.contains(
      "download a copy of any files attached to this application (ZIP)",
    );

    // Return to main page
    cy.get(".govuk-button").click();
    cy.contains(Cypress.env("testV2InternalGrant").schemeName);
    cy.contains("Cannot download 1 application");
    cy.contains("V2 Limited Company");
  });
});
