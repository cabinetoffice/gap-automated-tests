import {
  clickSaveAndContinue,
  signInToIntegrationSite,
  searchForGrant,
  signInAsApplyApplicant,
  clickText,
  clickSave,
} from "../../common/common";
import {
  fillOutEligibity,
  submitApplication,
  equalitySectionAccept,
  equalitySectionDecline,
} from "./helper";

// Details object
const details = {
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

const fillMandatoryQuestions = (orgProfileFilled) => {
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
    ["addressLine1", "addressLine2", "city", "county", "postcode"].forEach(
      (item, index) => {
        cy.get(`[data-cy=cy-${item}-text-input]`)
          .should("have.value", "")
          .type(details.address[index]);
      },
    );
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
    .type(details.howMuchFunding);
  clickSaveAndContinue();

  // Where will this funding be spent
  cy.contains("Where will this funding be spent?").should("exist");
  details.fundingLocation.forEach((item) => {
    // cy.get('[data-cy="cy-checkbox-value-North East England"]')
    cy.get(`[data-cy="cy-checkbox-value-${item}"]`)
      .should("not.be.checked")
      .click();
  });
  clickSaveAndContinue();
};

const fillOrgProfile = () => {
  // Open Org Profile Page
  cy.get('[data-cy="cy-link-card-Your organisation details"]').click();

  // Name
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationName"]',
  ).click();
  cy.get('[data-cy="cy-legalName-text-input"]').clear().type(details.name);
  clickSave();

  // Address
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationAddress"]',
  ).click();
  ["addressLine1", "addressLine2", "town", "county", "postcode"].forEach(
    (item, index) => {
      cy.get(`[data-cy=cy-${item}-text-input]`)
        .clear()
        .type(details.address[index]);
    },
  );
  clickSave();

  // Org Type
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationType"]',
  ).click();
  cy.get('[data-cy="cy-radioInput-option-LimitedCompany"]').click();
  clickSave();

  // Companies House
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationCompaniesHouseNumber"]',
  ).click();
  cy.get('[data-cy="cy-companiesHouseNumber-text-input"]')
    .clear()
    .type(details.companiesHouse);
  clickSave();

  // Charities Commission
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationCharity"]',
  ).click();
  cy.get('[data-cy="cy-charityCommissionNumber-text-input"]')
    .clear()
    .type(details.charitiesCommission);
  clickSave();

  // Back to account
  cy.get('[data-cy="cy-back-to-dashboard-button"]').click();
};

const partialFillOrgProfile = () => {
  // Open Org Profile Page
  cy.get('[data-cy="cy-link-card-Your organisation details"]').click();

  // Name - Blank
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationName"]',
  ).click();
  cy.get('[data-cy="cy-legalName-text-input"]').clear();
  clickSave();

  // Address
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationAddress"]',
  ).click();
  ["addressLine1", "addressLine2", "town", "county", "postcode"].forEach(
    (item, index) => {
      cy.get(`[data-cy=cy-${item}-text-input]`)
        .clear()
        .type(details.address[index]);
    },
  );
  clickSave();

  // Org Type - Filled
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationType"]',
  ).click();
  cy.get('[data-cy="cy-radioInput-option-LimitedCompany"]').click();
  clickSave();

  // Companies House - Blank
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationCompaniesHouseNumber"]',
  ).click();
  cy.get('[data-cy="cy-companiesHouseNumber-text-input"]').clear();
  clickSave();

  // Charities Commission
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationCharity"]',
  ).click();
  cy.get('[data-cy="cy-charityCommissionNumber-text-input"]')
    .clear()
    .type(details.charitiesCommission);
  clickSave();

  // Back to account
  cy.get('[data-cy="cy-back-to-dashboard-button"]').click();
};

const confirmDetails = () => {
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

const editDetailsOnSummaryScreen = () => {
  // Name
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationName"]',
  ).click();

  cy.contains("Enter the name of your organisation").should("exist");
  cy.get("[data-cy=cy-name-text-input]")
    .should("have.value", details.name)
    .type("1");
  clickSaveAndContinue();

  cy.get('[data-cy="cy-organisation-value-Name"]').contains(details.name + "1");

  // Address
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationAddress"]',
  ).click();

  cy.contains("Enter your organisation's address").should("exist");
  ["addressLine1", "addressLine2", "city", "county", "postcode"].forEach(
    (item, index) => {
      cy.get(`[data-cy=cy-${item}-text-input]`)
        .should("have.value", details.address[index])
        .clear()
        .type(details.address[index] + "1");
    },
  );
  clickSaveAndContinue();

  cy.get("[data-cy=cy-organisation-value-Address]")
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        details.address[index] + "1" + (index < 4 ? "," : ""),
      );
    });

  // Org Type
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationType"]',
  ).click();

  cy.contains("Choose your application type");
  [
    "Other",
    "IAmApplyingAsAnIndividual",
    "Charity",
    "LimitedCompany",
    "NonLimitedCompany",
  ].forEach((item) => {
    cy.get(`[data-cy=cy-radioInput-option-${item}]`)
      .should("not.be.checked")
      .click();
  });
  clickSaveAndContinue();

  cy.get('[data-cy="cy-organisation-value-Type of organisation"]').contains(
    "Non-limited company",
  );

  // Companies House
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationCompaniesHouseNumber"]',
  ).click();

  cy.contains("Enter your Companies House number (if you have one)");
  cy.get("[data-cy=cy-companiesHouseNumber-text-input]")
    .should("have.value", details.companiesHouse)
    .clear()
    .type(details.companiesHouse + "1");
  clickSaveAndContinue();

  cy.get('[data-cy="cy-organisation-value-Companies House number"]').contains(
    details.companiesHouse + "1",
  );

  // Charities Commission
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationCharity"]',
  ).click();

  cy.contains("Enter your Charity Commission number (if you have one)");
  cy.get("[data-cy=cy-charityCommissionNumber-text-input]")
    .should("have.value", details.charitiesCommission)
    .clear()
    .type(details.charitiesCommission + "1");
  clickSaveAndContinue();

  cy.get(
    '[data-cy="cy-organisation-value-Charity Commission number"]',
  ).contains(details.charitiesCommission + "1");

  // How much funding
  cy.get(
    '[data-cy="cy-organisation-details-navigation-fundingAmount"]',
  ).click();

  cy.contains("How much funding are you applying for?");
  cy.get("[data-cy=cy-fundingAmount-text-input-numeric]")
    .should("have.value", details.howMuchFunding)
    .clear()
    .type(details.howMuchFunding + "1");
  clickSaveAndContinue();

  cy.get(
    '[data-cy="cy-organisation-value-How much funding are you applying for?"]',
  ).contains(`£ ${details.howMuchFunding}1`);

  // Where will this funding be spent
  cy.get(
    '[data-cy="cy-organisation-details-navigation-fundingLocation"]',
  ).click();

  cy.contains("Where will this funding be spent?").should("exist");
  details.fundingLocation.forEach((item) => {
    // cy.get('[data-cy="cy-checkbox-value-North East England"]')
    cy.get(`[data-cy="cy-checkbox-value-${item}"]`)
      .should("be.checked")
      .click();
  });
  cy.get(`[data-cy="cy-checkbox-value-${details.fundingLocation[0]}"]`).click();
  clickSaveAndContinue();

  cy.get(
    '[data-cy="cy-organisation-value-Where will this funding be spent?"] > .govuk-list > li',
  ).contains(details.fundingLocation[0]);
};

const confirmOrgAndFundingDetails = (suffix, orgType, fundingLocations) => {
  // Check Org Details Match
  cy.get('[data-cy="cy-section-title-link-Your Organisation"]').click();
  cy.get('[data-cy="cy-manage-section-header"]').contains("Your Organisation");

  cy.get(`[data-cy="cy-section-value-${details.name + suffix}"]`).should(
    "exist",
  );
  cy.get(`[data-cy="cy-section-value-${orgType}"]`).should("exist");
  cy.get('[data-cy="cy-organisation-value-APPLICANT_ORG_ADDRESS"]')
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        details.address[index] + suffix + (index < 4 ? "," : ""),
      );
    });
  cy.get(
    `[data-cy="cy-section-value-${details.companiesHouse + suffix}"]`,
  ).should("exist");
  cy.get(
    `[data-cy="cy-section-value-${details.charitiesCommission + suffix}"]`,
  ).should("exist");

  cy.get('[data-cy="cy-isComplete-question-title"]').contains(
    "Have you completed this section?",
  );
  cy.get('[data-cy="cy-radioInput-option-YesIveCompletedThisSection"]').click();
  clickSaveAndContinue();
  cy.get('[data-cy="cy-status-tag-Your Organisation-Completed"]').should(
    "exist",
  );

  // Check Funding Details Match
  cy.get('[data-cy="cy-status-tag-Funding-In Progress"]').should("exist");
  cy.get('[data-cy="cy-section-title-link-Funding"]').click();
  cy.get('[data-cy="cy-section-title-link-Funding"]').contains("Funding");

  cy.get(
    `[data-cy="cy-section-value-${details.howMuchFunding + suffix}"]`,
  ).should("exist");
  cy.get('[data-cy="cy-organisation-value-BENEFITIARY_LOCATION"] > .govuk-list')
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        details.fundingLocation[index] +
          (index < fundingLocations.length - 1 ? "," : ""),
      );
    });

  cy.get('[data-cy="cy-isComplete-question-title"]').contains(
    "Have you completed this section?",
  );
  cy.get('[data-cy="cy-radioInput-option-YesIveCompletedThisSection"]').click();
  clickSaveAndContinue();
  cy.get('[data-cy="cy-status-tag-Funding-Completed"]').should("exist");
};

describe("Apply for a Grant V2", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  /*
  Test Coverage:
  - Internal Application
  - External Application
  - Empty Org Profile
  - Full Org Profile
  - Complete E&D Questions
  - Skip E&D Questions
   */
  it("Mandatory Questions Flow - Empty & Filled Organisation Profile", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

    // Sign in
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant(Cypress.currentRetry);

    // 1. EMPTY ORG PROFILE
    /*
    Test Coverage:
    - Internal Application
    - Empty Org Profile
    - Complete E&D Questions
    */

    // Search & Start internal application
    cy.get('[data-cy="cy-find-a-grant-link"]').click();
    searchForGrant("Cypress");
    cy.contains(Cypress.env("testV2InternalGrant").name).click();
    cy.contains("Start new application").invoke("removeAttr", "target").click();

    // Before you start
    cy.contains("Before you start");
    cy.contains("Continue").click();

    // Mandatory Questions & Confirm Details
    fillMandatoryQuestions(false);
    confirmDetails(0, "");

    // Click through and edit fields
    editDetailsOnSummaryScreen();

    // Confirm and submit application
    clickText("Confirm and submit");

    // Your Application page

    // Check page is loaded
    cy.get(
      '[data-cy="cy-application-name-Cypress - Test Application V2 Internal"]',
    ).should("exist");
    cy.get('[data-cy="cy-application-header"]').should("exist");

    // Check status of tasks - Pre Eligibility
    cy.get('[data-cy="cy-status-tag-Eligibility-Not Started"]').should("exist");
    cy.get(
      '[data-cy="cy-status-tag-Your Organisation-Cannot Start Yet"]',
    ).should("exist");
    cy.get('[data-cy="cy-status-tag-Funding-Cannot Start Yet"]').should(
      "exist",
    );

    fillOutEligibity();

    // Check status of tasks - Post Eligibility
    cy.get('[data-cy="cy-status-tag-Eligibility-Completed"]').should("exist");
    cy.get('[data-cy="cy-status-tag-Your Organisation-In Progress"]').should(
      "exist",
    );
    cy.get('[data-cy="cy-status-tag-Funding-In Progress"]').should("exist");

    // Confirm Org & Funding Details and Submit
    confirmOrgAndFundingDetails("1", "Non-limited company", [
      "North East (England)",
    ]);
    submitApplication();

    // Fill E&D Questions and return to dashboard
    equalitySectionAccept();
    clickText("View your applications");
    clickText("Back");

    // 2. FILLED ORG PROFILE (INCOMPLETE)
    /*
    Test Coverage:
    - External Application
    - Full Org Profile
    */

    // Refill Org Profile
    fillOrgProfile();

    // Search & Start external application
    cy.get('[data-cy="cySearch grantsPageLink"] > .govuk-link').click();
    cy.get('[data-cy="cySearchAgainInput"]').type("Cypress");
    cy.get('[data-cy="cySearchAgainButton"]').click();

    cy.contains(Cypress.env("testV2ExternalGrant").name).click();
    cy.contains("Start new application").invoke("removeAttr", "target").click();
  });

  it("Mandatory Questions Flow - Partially Filled Org Profile", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

    // Sign in
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant(Cypress.currentRetry);

    /*
    Test Coverage:
    - Internal Application
    - Partially Filled Org Profile
    - Skip E&D Questions
    */

    // Partially fill org profile
    partialFillOrgProfile();

    // Search & Start new application
    cy.get('[data-cy="cySearch grantsPageLink"] > .govuk-link').click();
    cy.get('[data-cy="cySearchAgainInput"]').type("Cypress");
    cy.get('[data-cy="cySearchAgainButton"]').click();

    cy.contains(Cypress.env("testV2InternalGrant").name).click();
    cy.contains("Start new application").invoke("removeAttr", "target").click();

    // Before you start
    cy.contains("Before you start");
    cy.contains("Continue").click();

    // Name - Should be empty
    cy.get('[data-cy="cy-name-text-input"]')
      .should("be.empty")
      .type(details.name);
    clickSaveAndContinue();

    // Address - should be full
    ["addressLine1", "addressLine2", "city", "county", "postcode"].forEach(
      (item, index) => {
        console.log(`[data-cy="cy-${item}-text-input"]`);
        cy.get(`[data-cy="cy-${item}-text-input"]`).should(
          "have.value",
          details.address[index],
        );
      },
    );
    clickSaveAndContinue();

    // Org Type - should be filled
    cy.get('[data-cy="cy-radioInput-option-LimitedCompany"]').should(
      "be.checked",
    );
    clickSaveAndContinue();

    // Companies House - should be empty
    cy.get('[data-cy="cy-companiesHouseNumber-text-input"]')
      .should("be.empty")
      .type(details.companiesHouse);
    clickSaveAndContinue();

    // Charities Commission - Should be filled
    cy.get('[data-cy="cy-charityCommissionNumber-text-input"]').should(
      "have.value",
      details.charitiesCommission,
    );
    clickSaveAndContinue();

    // Complete rest of MQ journey
    fillMandatoryQuestions(true);
    confirmDetails();
    clickText("Confirm and submit");

    // Complete & Submit application
    fillOutEligibity();
    confirmOrgAndFundingDetails("", "Limited company", details.fundingLocation);
    submitApplication();

    // Skip E&D questions and return to dashboard
    equalitySectionDecline();
    clickText("View your applications");
    clickText("Back");
  });
});
