import {
  signInToIntegrationSite,
  signInAsAdmin,
  signInAsApplyApplicant,
  signOut,
  searchForGrant,
  clickText,
  clickBack,
  clickSaveAndContinue,
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
} from "./helper";
import {
  confirmOrgAndFundingDetails,
  equalitySectionDecline,
  fillMandatoryQuestions,
  fillOutEligibity,
  submitApplication,
} from "../applicant/helper";

const GRANT_NAME = `Cypress Admin E2E Test Grant ID:${Cypress.env(
  "firstUserId",
)}`;

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

describe("Create a Grant", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("can create a new Grant and create advert", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();
    createGrant(GRANT_NAME);

    // create advert
    advertSection1(GRANT_NAME);
    advertSection2();
    advertSection3(true);
    advertSection4();
    advertSection5();

    publishAdvert(true);

    applicationForm();
  });

  it("V2 External - Download due dilligence data", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

    // Sign in as admin
    // Create the grant
    // Sign out
    // Log back in as applicant
    // Fill application and submit
    // Sign out
    // Log back in as admin
    // Open the grant
    // Manage Due Diligence Page
    // Download the stuff

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
    fillMandatoryQuestions(false, MQ_DETAILS);
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
    assertDownloadUrlWorks({ selector: ":nth-child(4) > .govuk-link" });
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

    fillMandatoryQuestions(false, MQ_DETAILS);
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
    cy.task("updateSpotlightSubmissionStatus", "SENT");

    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();

    cy.get('[data-cy="cy_SchemeListButton"]').click();
    cy.get(
      "[data-cy='cy_linkToScheme_Cypress - Test Scheme V2 Internal']",
    ).click();

    clickText("Manage due diligence checks");

    cy.contains("You have 1 application in Spotlight.");
    
    //due dilligence downloads
    assertDownloadUrlWorks({ selector: ":nth-child(4) > .govuk-link" });
    assertDownloadUrlWorks({ selector: ":nth-child(6) > .govuk-link" });

    clickBack();

    cy.task("updateSpotlightSubmissionStatus", "GGIS_ERROR");

    cy.task("addSpotlightBatch");
    cy.task("addSubmissionToMostRecentBatch");

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

    cy.task("updateSpotlightSubmissionStatus", "SEND_ERROR");
    clickText("Manage due diligence checks");
    cy.contains(
      "Due to a service outage, we cannot automatically send data to Spotlight at the moment. This affects 1 of your records.",
    );
    clickBack();
    cy.task("updateSpotlightSubmissionStatus", "VALIDATION_ERROR");
    clickText("Manage due diligence checks");
    cy.debug();
    cy.contains("We can't send your data to Spotlight");
    cy.task("cleanupTestSpotlightSubmissions");
  });
});

const assertDownloadUrlWorks = ({ selector }) => {
  cy.get(selector)
    .invoke("attr", "href")
    .then((url) => {
      cy.request(url).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
};
