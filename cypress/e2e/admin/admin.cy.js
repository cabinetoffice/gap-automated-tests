import {
  signInToIntegrationSite,
  signInAsAdmin,
  signInAsApplyApplicant,
  signOut,
  searchForGrant,
  clickText,
  clickBack,
  clickSaveAndContinue,
  assert200,
  yesQuestionComplete,
} from "../../common/common";
import {
  publishAdvert,
  applicationForm,
  createGrant,
  advertSection1,
  advertSection2,
  advertSection3,
  advertSection4,
  advertSection5,
  checkAdvertIsPublished,
} from "./helper";
import {
  confirmOrgAndFundingDetails,
  equalitySectionDecline,
  fillMqFunding,
  fillMqOrgQuestionsAsLimitedCompany,
  fillOutCustomSection,
  fillOutEligibity,
  fillOutRequiredChecks,
  submitApplication,
} from "../applicant/helper";
import {
  MQ_DETAILS,
  GRANT_NAME,
  TASKS,
  SPOTLIGHT_SUBMISSION_STATUS,
} from "./constants";

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
    cy.task("setUpFindData");
    signInToIntegrationSite();
  });

  it("can create a new Grant and create advert", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();
    createGrant(GRANT_NAME);

    // create advert
    advertSection1(GRANT_NAME);
    advertSection2();
    advertSection3(false);
    advertSection4();
    advertSection5();

    publishAdvert(false);

    applicationForm();

    cy.log("Add application form link to grant advert");
    cy.log("Capturing application form link as alias");
    cy.get(".break-all-words > .govuk-link")
      .invoke("text")
      .then(() => {})
      .as("advertLink");

    clickText("Manage this grant");

    cy.log("Adding application form link to the grant advert");
    cy.get('[data-cy="cyViewOrChangeYourAdvert-link"]').click();
    cy.get('[data-cy="cy-unpublish-advert-button"]').click();
    cy.get('[data-cy="cy-radioInput-option-YesUnpublishMyAdvert"]').click();

    cy.log("Unpublishing application");
    cy.get('[data-cy="cy_unpublishConfirmation-ConfirmButton"]').click();
    cy.get(
      '[data-cy="cy-4. How to apply-sublist-task-name-Link to application form"]',
    ).click();
    cy.get('[data-cy="cy-grantWebpageUrl-text-input"]').clear();
    cy.get("@advertLink").then((link) => {
      console.log(link);
      cy.get('[data-cy="cy-grantWebpageUrl-text-input"]').click().type(link);
    });
    yesQuestionComplete();
    clickText("Review and publish");

    cy.log("Republishing unpublished application");
    cy.get('[data-cy="cy-button-Confirm and publish"]').click();
    clickText("Sign out");

    checkAdvertIsPublished(GRANT_NAME);

    // TODO : Unpublish advert
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsAdmin();

    // TODO : Sign out - Log in as an applicant, check that the grant is NOT there
  });

  it("V2 External - Download due dilligence data", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

    // Sign out and complete application as applicant
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant();

    // Search & Start internal application
    cy.get('[data-cy="cy-find-a-grant-link"]').click();
    searchForGrant(Cypress.env("testV2ExternalGrant").advertName);
    cy.contains(Cypress.env("testV2ExternalGrant").advertName).click();
    cy.contains("Start new application").invoke("removeAttr", "target").click();

    // Before you start
    cy.contains("Before you start");
    cy.contains("Continue").click();

    // Mandatory Questions & Confirm Details
    fillMqOrgQuestionsAsLimitedCompany(MQ_DETAILS);
    fillMqFunding(MQ_DETAILS);
    clickText("Confirm and submit");

    // Sign in as admin
    signOut();
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();

    // View grant and get due diligence data
    cy.get('[data-cy="cy_SchemeListButton"]').click();
    cy.get(
      '[data-cy="cy_linkToScheme_Cypress - Test Scheme V2 External"]',
    ).click();
    cy.get(".govuk-button--secondary").click();

    // Check download link works
    assert200(cy.get(":nth-child(4) > .govuk-link"));
  });

  it("Can access and use 'Manage Due Dillegence Checks' (spotlight)", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);
    // Sign out and complete application as applicant
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant();
    cy.get('[data-cy="cy-find-a-grant-link"]').click();
    searchForGrant(Cypress.env("testV2InternalGrant").advertName);
    cy.contains(Cypress.env("testV2InternalGrant").advertName).click();
    cy.contains("Start new application").invoke("removeAttr", "target").click();

    cy.contains("Before you start");
    cy.contains("Continue").click();

    fillMqOrgQuestionsAsLimitedCompany(MQ_DETAILS);
    fillMqFunding(MQ_DETAILS);
    clickText("Confirm and submit");
    fillOutEligibity();

    confirmOrgAndFundingDetails(
      "",
      "Limited company",
      MQ_DETAILS.fundingLocation,
      MQ_DETAILS,
    );
    submitApplication();
    equalitySectionDecline();
    clickText("View your applications");
    clickText("Back");

    signOut();
    cy.task(UPDATE_SPOTLIGHT_SUBMISSION_STATUS, SENT);

    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();

    cy.get('[data-cy="cy_SchemeListButton"]').click();
    cy.get(
      "[data-cy='cy_linkToScheme_Cypress - Test Scheme V2 Internal']",
    ).click();

    clickText("Manage due diligence checks");

    cy.contains("You have 1 application in Spotlight.");

    // due dilligence downloads
    assert200(cy.get(":nth-child(4) > .govuk-link"));
    assert200(cy.get(":nth-child(6) > .govuk-link"));

    clickBack();

    cy.task(UPDATE_SPOTLIGHT_SUBMISSION_STATUS, GGIS_ERROR);

    cy.task(ADD_SPOTLIGHT_BATCH);
    cy.task(ADD_SUBMISSION_TO_MOST_RECENT_BATCH);

    clickText("Manage due diligence checks");

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

    cy.task(UPDATE_SPOTLIGHT_SUBMISSION_STATUS, SEND_ERROR);
    clickText("Manage due diligence checks");
    cy.contains(
      "Due to a service outage, we cannot automatically send data to Spotlight at the moment. This affects 1 of your records.",
    );
    clickBack();
    cy.task(UPDATE_SPOTLIGHT_SUBMISSION_STATUS, VALIDATION_ERROR);
    clickText("Manage due diligence checks");
    cy.debug();
    cy.contains("We can't send your data to Spotlight");
    cy.task(CLEANUP_TEST_SPOTLIGHT_SUBMISSIONS);
  });

  it("V1 Internal - Download Due Diligence Data", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

    // Sign in and complete application as applicant
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant();

    // Search & Start internal application
    cy.get('[data-cy="cy-find-a-grant-link"]').click();
    searchForGrant(Cypress.env("testV1InternalGrant").advertName);
    cy.contains(Cypress.env("testV1InternalGrant").advertName).click();
    cy.contains("Start new application").invoke("removeAttr", "target").click();

    // Complete application
    fillOutEligibity();
    fillOutRequiredChecks();
    fillOutCustomSection();
    submitApplication();
    equalitySectionDecline();

    // Sign in as admin
    signOut();
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();

    // View V1 internal grant
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
  });
});
