import {
  signInToIntegrationSite,
  signInAsAdmin,
  signInAsApplyApplicant,
  signOut,
  searchForGrant,
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
import { fillMandatoryQuestions } from "../applicant/helper";

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
    createGrant();

    // create advert
    advertSection1();
    advertSection2();
    advertSection3();
    advertSection4();
    advertSection5();

    publishAdvert();

    applicationForm();
  });

  it("mq admin flow", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();

    createGrant();

    advertSection1();
    advertSection2();
    advertSection3();
    advertSection4();
    advertSection5();
    publishAdvert();

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
    signOut();
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant();

    // Search & Start internal application
    cy.get('[data-cy="cy-find-a-grant-link"]').click();
    searchForGrant(GRANT_NAME);
    cy.contains(GRANT_NAME).click();
    cy.contains("Start new application").invoke("removeAttr", "target").click();

    // Before you start
    cy.contains("Before you start");
    cy.contains("Continue").click();

    // Mandatory Questions & Confirm Details
    fillMandatoryQuestions(false, MQ_DETAILS);
  });
});

// const getIframeDocument = (iFrameSelector) => {
//   return (
//     cy
//       .get(iFrameSelector)
//       // Cypress yields jQuery element, which has the real
//       // DOM element under property "0".
//       // From the real DOM iframe element we can get
//       // the "document" element, it is stored in "contentDocument" property
//       // Cypress "its" command can access deep properties using dot notation
//       // https://on.cypress.io/its
//       .its("0.contentDocument")
//       .should("exist")
//   );
// };
//
// const getIframeBody = (iFrameSelector) => {
//   cy.wait(2000);
//   // get the document
//   return (
//     getIframeDocument(iFrameSelector)
//       // automatically retries until body is loaded
//       .its("body")
//       .should("not.be.undefined")
//       // wraps "body" DOM element to allow
//       // chaining more Cypress commands, like ".find(...)"
//       .then(cy.wrap)
//   );
// };
