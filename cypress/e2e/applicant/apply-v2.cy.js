import {
  clickSaveAndContinue,
  signInToIntegrationSite,
  searchForGrant,
  signInAsApplyApplicant,
} from "../../common/common";
// import {
//   fillOutCustomSection,
//   fillOutEligibity,
//   fillOutRequiredChecks,
//   submitApplication,
//   equalitySectionAccept,
//   equalitySectionDecline,
// } from "./helper";

const userId = Math.abs(+Cypress.env("firstUserId"));

const fillMandatoryQuestions = (details, orgProfileFilled) => {
  // If Org Profile isn't filled go through all pages
  if (!orgProfileFilled) {
    // Name
    cy.contains("Enter the name of your organisation").should("exist");
    cy.get("[data-cy=cy-name-text-input]")
      .should("have.value", "")
      .type(details.name);
    clickSaveAndContinue();

    // Address
    cy.contains("Enter your organisation's address").should("exist");
    details.address.forEach((item) => {
      cy.get(`[data-cy=cy-${item}-text-input]`)
        .should("have.value", "")
        .type(item);
    });
    clickSaveAndContinue();

    // Org Type
    cy.contains("Choose your application type").should("exist");
    [
      "Other",
      "IAmApplyingAsAnIndividual",
      "Charity",
      "NonLimitedCompany",
      "LimitedCompany",
    ].forEach((item) => {
      cy.get(`[data-cy=cy-radioInput-option-${item}]`)
        .should("not.be.checked")
        .click();
    });
    clickSaveAndContinue();

    // Companies House
    cy.contains("Enter your Companies House number (if you have one)").should(
      "exist",
    );
    cy.get("[data-cy=cy-companiesHouseNumber-text-input]")
      .should("have.value", "")
      .type(details.companiesHouse);
    clickSaveAndContinue();

    // Charities Commission
    cy.contains(
      "Enter your Charity Commission number (if you have one)",
    ).should("exist");
    cy.get("[data-cy=cy-charityCommissionNumber-text-input]")
      .should("have.value", "")
      .type(details.charitiesCommission);
    clickSaveAndContinue();
  }

  // How much funding
  cy.contains("How much funding are you applying for?").should("exist");
  cy.get("[data-cy=cy-fundingAmount-text-input-numeric]")
    .should("have.value", "")
    .type("100");
  clickSaveAndContinue();

  // Where will this funding be spent
  cy.contains("Where will this funding be spent?").should("exist");
  // [
  //   "North East England (England)",
  //   "North West (England)",
  //   "Yorkshire and The Humber",
  //   "East Midlands (England)",
  //   "West Midlands (England)",
  //   "East England",
  //   "London",
  //   "South East (England)",
  //   "South West (England)",
  //   "Scotland",
  //   "Wales",
  //   "Northern Ireland",
  //   "Outside of the UK",
  // ]
  [
    "North East England",
    "North West England",
    "Yorkshire and the Humber",
    "East Midlands (England)",
    "West Midlands",
    "East England",
    "London",
    "South East England",
    "South West England",
    "Scotland",
    "Wales",
    "Northern Ireland",
    "Outside UK",
  ].forEach((item) => {
    // cy.get('[data-cy="cy-checkbox-value-North East England"]')
    cy.get(`[data-cy="cy-checkbox-value-${item}"]`)
      .should("not.be.checked")
      .click();
  });
  clickSaveAndContinue();
};

const confirmDetails = (details) => {
  // Confirm your details
  cy.contains("Confirm your details").should("exist");

  cy.get('[data-cy="cy-organisation-value-Name"]').contains(details.name);

  cy.get("[data-cy=cy-organisation-value-Address]")
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        details.address[index] + (index < 4 ? "," : ""),
      );
    });

  cy.get('[data-cy="cy-organisation-value-Type of organisation"]').contains(
    details.orgType,
  );
  cy.get('[data-cy="cy-organisation-value-Companies House number"]').contains(
    details.companiesHouse,
  );
  cy.get(
    '[data-cy="cy-organisation-value-Charity Commission number"]',
  ).contains(details.charitiesCommission);
  cy.get(
    '[data-cy="cy-organisation-value-How much funding are you applying for?"]',
  ).contains(`£ ${details.howMuchFunding}`);

  cy.get(
    '[data-cy="cy-organisation-value-Where will this funding be spent?"] > .govuk-list',
  )
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        details.fundingLocation[index] + (index < 12 ? "," : ""),
      );
    });
};

describe("Apply for a Grant V2", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Mandatory questions flow - Empty organisation profile", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

    console.log("USERID!!!!!!" + userId);

    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant(Cypress.currentRetry);

    cy.get('[data-cy="cy-find-a-grant-link"]').click();

    // Get working with Cypress grant
    searchForGrant("Cypress");
    cy.contains(
      `Cypress - Automated E2E Test Grant V2 Internal ID:${userId}`,
    ).click();

    cy.contains("Start new application").invoke("removeAttr", "target").click();

    // make better
    // cy.visit(`${Cypress.env("postLoginBaseUrl")}/apply/applicant/applications/-${userId + 1}`);

    // Before you start
    cy.contains("Before you start");
    cy.contains("Continue").click();

    // Details object - Sandbox
    const details = {
      name: "MyOrg",
      address: ["addressLine1", "addressLine2", "city", "county", "postcode"],
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
        "East England",
        "London",
        "South East (England)",
        "South West (England)",
        "Scotland",
        "Wales",
        "Northern Ireland",
        "Outside of the UK",
      ],
    };

    // Details object - QA
    // const details = {
    //   name: "MyOrg",
    //   address: ["addressLine1", "addressLine2", "city", "county", "postcode"],
    //   orgType: "Limited company",
    //   companiesHouse: "12345",
    //   charitiesCommission: "67890",
    //   howMuchFunding: "100",
    //   fundingLocation: [
    //     "North East England",
    //     "North West England",
    //     "Yorkshire and the Humber",
    //     "East Midlands (England)",
    //     "West Midlands",
    //     "East England",
    //     "London",
    //     "South East England",
    //     "South West England",
    //     "Scotland",
    //     "Wales",
    //     "Northern Ireland",
    //     "Outside UK",
    //   ],
    // };

    // Mandatory Questions & Confirm Details
    fillMandatoryQuestions(details, false);
    confirmDetails(details);

    // Click through and edit fields

    // Name
    cy.get(
      '[data-cy="cy-organisation-details-navigation-organisationName"]',
    ).click();

    cy.contains("Enter the name of your organisation").should("exist");
    cy.get("[data-cy=cy-name-text-input]")
      .should("have.value", details.name)
      .type("1");
    clickSaveAndContinue();

    cy.get('[data-cy="cy-organisation-value-Name"]').contains(
      details.name + "1",
    );

    // Address
    cy.get(
      '[data-cy="cy-organisation-details-navigation-organisationAddress"]',
    ).click();

    cy.contains("Enter your organisation's address").should("exist");
    details.address.forEach((item, index) => {
      cy.get(`[data-cy=cy-${item}-text-input]`)
        .should("have.value", item)
        .clear()
        .type(index === 4 ? "postcod1" : item + "1");
    });
    clickSaveAndContinue();

    cy.get("[data-cy=cy-organisation-value-Address]")
      .find("ul")
      .children("li")
      .each((listItem, index) => {
        cy.wrap(listItem).contains(
          (index === 4 ? "postcod1" : details.address[index] + "1") +
            (index < 4 ? "," : ""),
        );
      });

    // Org Type
    cy.contains("Choose your application type").should("exist");
    [
      "Other",
      "IAmApplyingAsAnIndividual",
      "Charity",
      "NonLimitedCompany",
      "LimitedCompany",
    ].forEach((item) => {
      cy.get(`[data-cy=cy-radioInput-option-${item}]`)
        .should("not.be.checked")
        .click();
    });
    clickSaveAndContinue();

    //   // Companies House
    //   cy.contains("Enter your Companies House number (if you have one)").should(
    //     "exist",
    //   );
    //   cy.get("[data-cy=cy-companiesHouseNumber-text-input]")
    //     .should("have.value", "")
    //     .type(details.companiesHouse);
    //   clickSaveAndContinue();

    //   // Charities Commission
    //   cy.contains(
    //     "Enter your Charity Commission number (if you have one)",
    //   ).should("exist");
    //   cy.get("[data-cy=cy-charityCommissionNumber-text-input]")
    //     .should("have.value", "")
    //     .type(details.charitiesCommission);
    //   clickSaveAndContinue();
    // }

    // // How much funding
    // cy.contains("How much funding are you applying for?").should("exist");
    // cy.get("[data-cy=cy-fundingAmount-text-input-numeric]")
    //   .should("have.value", "")
    //   .type("100");
    // clickSaveAndContinue();

    // // Where will this funding be spent
    // cy.contains("Where will this funding be spent?").should("exist");
    // // [
    // //   "North East England (England)",
    // //   "North West (England)",
    // //   "Yorkshire and The Humber",
    // //   "East Midlands (England)",
    // //   "West Midlands (England)",
    // //   "East England",
    // //   "London",
    // //   "South East (England)",
    // //   "South West (England)",
    // //   "Scotland",
    // //   "Wales",
    // //   "Northern Ireland",
    // //   "Outside of the UK",
    // // ]
    // [
    //   "North East England",
    //   "North West England",
    //   "Yorkshire and the Humber",
    //   "East Midlands (England)",
    //   "West Midlands",
    //   "East England",
    //   "London",
    //   "South East England",
    //   "South West England",
    //   "Scotland",
    //   "Wales",
    //   "Northern Ireland",
    //   "Outside UK",
    // ].forEach((item) => {
    //   // cy.get('[data-cy="cy-checkbox-value-North East England"]')
    //   cy.get(`[data-cy="cy-checkbox-value-${item}"]`)
    //     .should("not.be.checked")
    //     .click();
    // });
    // clickSaveAndContinue();

    // Return to summary after each edit
    // Click confirm and submit
    // Do this all for internal and external applications

    // Going to have two more it() for partial filled org profile and filled org profile
  });
});
