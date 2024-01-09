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

const {
  UPDATE_SPOTLIGHT_SUBMISSION_STATUS,
  ADD_SPOTLIGHT_BATCH,
  ADD_SUBMISSION_TO_MOST_RECENT_BATCH,
  CLEANUP_TEST_SPOTLIGHT_SUBMISSIONS,
  REMOVE_ADVERT_BY_NAME,
} = TASKS;

const { SENT, SEND_ERROR, GGIS_ERROR, VALIDATION_ERROR } =
  SPOTLIGHT_SUBMISSION_STATUS;

describe("Create a Grant", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Admin can view the dashboard, cannot access the super-admin dashboard", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();

    cy.log("Logged into admin account - asserting on dashboard content");
    cy.contains("Your grants");
    cy.contains(Cypress.env("testV1InternalGrant").schemeName);
    cy.contains(Cypress.env("testV2InternalGrant").schemeName);
    cy.contains("View all grants").click();
    cy.contains("All grants");
    cy.log("asserting on content within the 'all grants' page");
    cy.contains(Cypress.env("testV2ExternalGrant").schemeName);
    cy.contains(Cypress.env("testV1ExternalGrant").schemeName);
    cy.contains(Cypress.env("testV2InternalGrant").schemeName);
    cy.contains(Cypress.env("testV1InternalGrant").schemeName);
    clickText("View");
    cy.contains("Grant summary");
    cy.log("asserting the admin cannot view the super admin dashboard");
    assert404(SUPER_ADMIN_DASHBOARD_URL);
  });

  it("Applicant promoted to admin can view the dashboard", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsSuperAdmin();
    cy.log("Promoting applicant account -> admin account");
    cy.get("[name=searchTerm]").type(Cypress.env("oneLoginApplicantEmail"));
    cy.get("[data-cy=cy-button-Search]").click();
    cy.get(
      '[data-cy="cy_table_row-for-Actions-row-0-cell-3"] > .govuk-link',
    ).click();
    clickText("Change");
    cy.get("[data-cy=cy-checkbox-value-3]").check();
    cy.log("Changing user roles");
    clickText("Change Roles");
    cy.log("Adding a department");
    cy.contains("Change").first().click();
    clickText("Cypress - Test Department");
    clickText("Change department");
    signOut();
    cy.log(
      "Super admin signed out -> logging in with newly promoted admin account",
    );
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsApplyApplicant();
    cy.log("asserting on content within the admin dashboard");
    cy.contains("Manage a grant");
    cy.contains(
      "Use this service to add your grant details and build an application form for applicants to use.",
    );
    cy.contains("Add grant details");
    cy.contains("Start by adding the details of your grant.");
  });

  it("Admin can create a new Grant with Advert and Application Form", () => {
    cy.task(REMOVE_ADVERT_BY_NAME, GRANT_NAME);
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    log("Admin grant creation journey - Signing in as admin");
    signInAsAdmin();
    log("Admin grant creation journey - creating Grant");
    createGrant(GRANT_NAME);

    // create advert
    log("Admin grant creation journey - creating Advert Section 1");
    advertSection1(GRANT_NAME);
    log("Admin grant creation journey - creating Advert Section 2");
    advertSection2();
    log("Admin grant creation journey - creating Advert Section 3");
    advertSection3(true);
    log("Admin grant creation journey - creating Advert Section 4");
    advertSection4();
    log("Admin grant creation journey - creating Advert Section 5");
    advertSection5();

    log("Admin grant creation journey - publishing advert");
    publishAdvert(true);

    log("Admin grant creation journey - creating application form");
    applicationForm();
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
    cy.get('[data-cy="cy_SchemeListButton"]').click();
    cy.get(
      '[data-cy="cy_linkToScheme_Cypress - Test Scheme V2 External"]',
    ).click();
    cy.get(".govuk-button--secondary").click();

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

  it.only("Can access and use 'Manage Due Diligence Checks' (spotlight)", () => {
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

    cy.task("ls", "/cypress/downloads/unzip/spotlight_checks").then((list) =>
      cy.log(list),
    );

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
    cy.wait(10000);

    log(
      "Admin V2 Internal - Manage Due Diligence & Spotlight - Validating downloaded submission export",
    );
    validateSubmissionDownload(Cypress.env("testV2InternalGrant").schemeId);
  });

  it("V1 Internal - Download Submission Export", () => {
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
    validateSubmissionDownload(Cypress.env("testV1InternalGrant").schemeId, 2);
    cy.readFile("cypress/downloads/unzip/submission_export/example_1.doc");
  });

  it("View scheme details of grant with application form and no advert", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();
    log("View scheme details with no advert journey - creating grant");
    createGrant(GRANT_NAME + " no advert");

    // create application form
    log(
      "View scheme details with no advert journey - creating application form",
    );
    applicationForm();

    // view scheme details
    cy.get("[data-cy=cy_publishSuccess-manageThisGrant-button]").click();
    cy.contains("Grant application form");
    cy.contains("View submitted applications");
    cy.contains(GRANT_NAME + " no advert");
  });

  it("View scheme details of grant with an advert and no application form", () => {
    cy.task(REMOVE_ADVERT_BY_NAME, GRANT_NAME + " no application form");
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();
    log("View scheme details with no application journey - creating grant");
    createGrant(GRANT_NAME + " no application form");

    // create advert
    log(
      "View scheme details with no application journey - creating Advert Section 1",
    );
    advertSection1(GRANT_NAME);
    log(
      "View scheme details with no application journey - creating Advert Section 2",
    );
    advertSection2();
    log(
      "View scheme details with no application journey - creating Advert Section 3",
    );
    advertSection3(false);
    log(
      "View scheme details with no application journey - creating Advert Section 4",
    );
    advertSection4();
    log(
      "View scheme details with no application journey - creating Advert Section 5",
    );
    advertSection5();

    log("View scheme details with no application journey - publishing advert");
    publishAdvert(false);

    cy.contains(
      "An advert for this grant is live on Find a grant. The link for your advert is below:",
    );
    cy.get('[data-cy="cy-link-to-advert-on-find"]').should("have.attr", "href");
    cy.contains("View or change your advert");
  });

  it("View scheme details of grant with application form and advert", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();
    log("View scheme details journey - creating Grant");
    createGrant(GRANT_NAME);

    // create advert
    log("View scheme details journey - creating Advert Section 1");
    advertSection1(GRANT_NAME);
    log("View scheme details journey - creating Advert Section 2");
    advertSection2();
    log("View scheme details journey - creating Advert Section 3");
    advertSection3(false);
    log("View scheme details journey - creating Advert Section 4");
    advertSection4();
    log("View scheme details journey - creating Advert Section 5");
    advertSection5();

    log("View scheme details journey - publishing advert");
    publishAdvert(false);

    log("View scheme details journey - creating application form");
    applicationForm();

    // view scheme details
    cy.get("[data-cy=cy_publishSuccess-manageThisGrant-button]").click();
    cy.contains("Grant application form");
    cy.contains("View submitted applications");
    cy.contains(GRANT_NAME);
    cy.contains(
      "An advert for this grant is live on Find a grant. The link for your advert is below:",
    );
    cy.get('[data-cy="cy-link-to-advert-on-find"]').should("have.attr", "href");
    cy.contains("View or change your advert");
  });

  it("View scheme details with an in progress application", () => {
    cy.task(REMOVE_ADVERT_BY_NAME, GRANT_NAME);
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();
    log(
      "View scheme details with application in progress journey - creating Grant",
    );
    createGrant(GRANT_NAME);

    // start application form
    cy.get('[data-cy="cyBuildApplicationForm"]').click();

    cy.get('[data-cy="cy-applicationName-text-input"]').click();
    cy.get('[data-cy="cy-applicationName-text-input"]').type(
      "Cypress - Grant Application",
      { force: true },
    );
    cy.get('[data-cy="cy-button-Continue"]').click();

    cy.get('[data-cy="cy_Section-Eligibility Statement"]').click();

    cy.get('[data-cy="cy-displayText-text-area"]').type("eligibility", {
      force: true,
    });

    saveAndExit();

    // exit build application form
    clickText("Exit");

    // view scheme details
    cy.contains("Grant application form");
    cy.contains(GRANT_NAME);

    // Resume building application form
    // cy.get('[data-cy="cy_table_row-for-Grant application form-row-0-cell-3"]').click();
    clickText("View");
    cy.get('[data-cy="cy_Section-due-diligence-checks"]').click();

    cy.on("uncaught:exception", () => false);

    cy.get(
      '[data-cy="cy-checkbox-value-I understand that applicants will be asked for this information"]',
    ).click();
    saveAndExit();

    // publish
    publishApplicationForm();
  });

  it("View scheme details with an in progress advert", () => {
    cy.task(REMOVE_ADVERT_BY_NAME, GRANT_NAME);
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();
    createGrant(GRANT_NAME);

    // create advert
    log(
      "Scheme details with an in progress advert journey - creating Advert Section 1",
    );
    advertSection1(GRANT_NAME);
    log(
      "Scheme details with an in progress advert journey - creating Advert Section 2",
    );
    advertSection2();

    // exit advert creation
    cy.get('[data-cy="cy-exit"]').click();

    cy.get('[data-cy="cyViewOrChangeYourAdvert-link"]').click();

    log(
      "Scheme details with an in progress advert journey - creating Advert Section 3",
    );
    advertSection3(false);
    log(
      "Scheme details with an in progress advert journey - creating Advert Section 4",
    );
    advertSection4();
    log(
      "Scheme details with an in progress advert journey - creating Advert Section 5",
    );
    advertSection5();

    log(
      "Scheme details with an in progress advert journey - publishing advert",
    );
    publishAdvert(false);

    cy.contains(
      "An advert for this grant is live on Find a grant. The link for your advert is below:",
    );

    cy.get('[data-cy="cy-link-to-advert-on-find"]').should("have.attr", "href");

    cy.contains("View or change your advert");
  });

  it("View scheme details with a scheduled advert", () => {
    cy.task(REMOVE_ADVERT_BY_NAME, GRANT_NAME);
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();
    log("View scheme details with scheduled advert journey  - creating Grant");
    createGrant(GRANT_NAME + " no application form");

    // create advert
    log(
      "View scheme details with scheduled advert journey - creating Advert Section 1",
    );
    advertSection1(GRANT_NAME);
    log(
      "View scheme details with scheduled advert journey - creating Advert Section 2",
    );
    advertSection2();
    log(
      "View scheme details with scheduled advert journey - creating Advert Section 3",
    );
    advertSection3(true);
    log(
      "View scheme details with scheduled advert journey - creating Advert Section 4",
    );
    advertSection4();
    log(
      "View scheme details with scheduled advert journey - creating Advert Section 5",
    );
    advertSection5();

    log(
      "View scheme details with scheduled advert journey - publishing advert",
    );
    publishAdvert(true);

    cy.contains("Grant advert");
    cy.contains("Your advert is scheduled to be published on");
    cy.contains("View or change your advert");
  });
});
