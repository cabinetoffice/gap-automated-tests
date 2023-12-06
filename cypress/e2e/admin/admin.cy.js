import {
  signInToIntegrationSite,
  signInAsAdmin,
  signInAsApplyApplicant,
  signOut,
  searchForGrant,
  clickText,
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
  equalitySectionDecline,
  fillMandatoryQuestions,
  fillOutCustomSection,
  fillOutEligibity,
  fillOutRequiredChecks,
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
    cy.get(":nth-child(4) > .govuk-link")
      .invoke("attr", "href")
      .then((url) => {
        cy.request(url).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
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
    cy.get('[data-cy="cy_Scheme-details-page-button-Download required checks"]')
      .should("not.be.disabled")
      .invoke("attr", "href")
      .then((url) => {
        cy.request(url).then((response) => {
          expect(response.status).to.eq(200);
        });
      });
  });
});
