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
  fillMandatoryQuestions,
} from "./helper";

// Details object
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

const fillOrgProfile = () => {
  // Open Org Profile Page
  cy.get('[data-cy="cy-link-card-Your saved information"]').click();

  // Org Type
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationType"]',
  ).click();
  cy.get('[data-cy="cy-radioInput-option-LimitedCompany"]').click();
  clickSave();

  // Name
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationName"]',
  ).click();
  cy.get('[data-cy="cy-legalName-text-input"]').clear().type(MQ_DETAILS.name);
  clickSave();

  // Address
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationAddress"]',
  ).click();
  ["addressLine1", "addressLine2", "town", "county", "postcode"].forEach(
    (item, index) => {
      cy.get(`[data-cy=cy-${item}-text-input]`)
        .clear()
        .type(MQ_DETAILS.address[index]);
    },
  );
  clickSave();

  // Companies House
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationCompaniesHouseNumber"]',
  ).click();
  cy.get('[data-cy="cy-companiesHouseNumber-text-input"]')
    .clear()
    .type(MQ_DETAILS.companiesHouse);
  clickSave();

  // Charities Commission
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationCharity"]',
  ).click();
  cy.get('[data-cy="cy-charityCommissionNumber-text-input"]')
    .clear()
    .type(MQ_DETAILS.charitiesCommission);
  clickSave();

  // Back to account
  cy.get('[data-cy="cy-back-to-dashboard-button"]').click();
};

const partialFillOrgProfile = () => {
  // Open Org Profile Page
  cy.get('[data-cy="cy-link-card-Your saved information"]').click();

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
        .type(MQ_DETAILS.address[index]);
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
    .type(MQ_DETAILS.charitiesCommission);
  clickSave();

  // Back to account
  cy.get('[data-cy="cy-back-to-dashboard-button"]').click();
};

const editDetailsOnSummaryScreen = () => {
  // Name
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationName"]',
  ).click();

  cy.contains("Enter the name of your organisation").should("exist");
  cy.get("[data-cy=cy-name-text-input]")
    .should("have.value", MQ_DETAILS.name)
    .type("1");
  clickSaveAndContinue();

  cy.get('[data-cy="cy-organisation-value-Name"]').contains(
    MQ_DETAILS.name + "1",
  );

  // Address
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationAddress"]',
  ).click();

  cy.contains("Enter your organisation's address").should("exist");
  ["addressLine1", "addressLine2", "city", "county", "postcode"].forEach(
    (item, index) => {
      cy.get(`[data-cy=cy-${item}-text-input]`)
        .should("have.value", MQ_DETAILS.address[index])
        .clear()
        .type(MQ_DETAILS.address[index] + "1");
    },
  );
  clickSaveAndContinue();

  cy.get("[data-cy=cy-organisation-value-Address]")
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        MQ_DETAILS.address[index] + "1" + (index < 4 ? "," : ""),
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
    "LimitedCompany",
    "NonLimitedCompany",
    "Charity",
  ].forEach((item) => {
    cy.get(`[data-cy=cy-radioInput-option-${item}]`)
      .should("not.be.checked")
      .click();
  });
  clickSaveAndContinue();

  cy.get('[data-cy="cy-organisation-value-Type of organisation"]').contains(
    "Charity",
  );

  // Companies House
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationCompaniesHouseNumber"]',
  ).click();

  cy.contains("Enter your Companies House number (if you have one)");
  cy.get("[data-cy=cy-companiesHouseNumber-text-input]")
    .should("have.value", MQ_DETAILS.companiesHouse)
    .clear()
    .type(MQ_DETAILS.companiesHouse + "1");
  clickSaveAndContinue();

  cy.get('[data-cy="cy-organisation-value-Companies House number"]').contains(
    MQ_DETAILS.companiesHouse + "1",
  );

  // Charities Commission
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationCharity"]',
  ).click();

  cy.contains("Enter your Charity Commission number (if you have one)");
  cy.get("[data-cy=cy-charityCommissionNumber-text-input]")
    .should("have.value", MQ_DETAILS.charitiesCommission)
    .clear()
    .type(MQ_DETAILS.charitiesCommission + "1");
  clickSaveAndContinue();

  cy.get(
    '[data-cy="cy-organisation-value-Charity Commission number"]',
  ).contains(MQ_DETAILS.charitiesCommission + "1");

  // How much funding
  cy.get(
    '[data-cy="cy-organisation-details-navigation-fundingAmount"]',
  ).click();

  cy.contains("How much funding are you applying for?");
  cy.get("[data-cy=cy-fundingAmount-text-input-numeric]")
    .should("have.value", MQ_DETAILS.howMuchFunding)
    .clear()
    .type(MQ_DETAILS.howMuchFunding + "1");
  clickSaveAndContinue();

  cy.get(
    '[data-cy="cy-organisation-value-How much funding are you applying for?"]',
  ).contains(`£ ${MQ_DETAILS.howMuchFunding}1`);

  // Where will this funding be spent
  cy.get(
    '[data-cy="cy-organisation-details-navigation-fundingLocation"]',
  ).click();

  cy.contains("Where will this funding be spent?").should("exist");
  MQ_DETAILS.fundingLocation.forEach((item) => {
    cy.get(`[data-cy="cy-checkbox-value-${item}"]`)
      .should("be.checked")
      .click();
  });
  cy.get(
    `[data-cy="cy-checkbox-value-${MQ_DETAILS.fundingLocation[0]}"]`,
  ).click();
  clickSaveAndContinue();

  cy.get(
    '[data-cy="cy-organisation-value-Where will this funding be spent?"] > .govuk-list > li',
  ).contains(MQ_DETAILS.fundingLocation[0]);
};

const editOrgAndFundingDetails = () => {
  // Open Org Details page
  cy.get('[data-cy="cy-section-title-link-Your organisation"]').click();

  // Check, Change & Check the details

  // Org Type
  cy.get(`[data-cy="cy-section-value-${MQ_DETAILS.orgType}"]`).should("exist");

  cy.get('[data-cy="cy-section-details-navigation-APPLICANT_TYPE"]').click();
  cy.get('[data-cy="cy-radioInput-option-Charity"]').click();
  clickSaveAndContinue();

  cy.get(`[data-cy="cy-section-value-Charity"]`).should("exist");

  // Name
  cy.get(`[data-cy="cy-section-value-${MQ_DETAILS.name}"]`).should("exist");

  cy.get(
    '[data-cy="cy-section-details-navigation-APPLICANT_ORG_NAME"]',
  ).click();
  cy.get("[data-cy=cy-name-text-input]")
    .should("have.value", MQ_DETAILS.name)
    .type("1");
  clickSaveAndContinue();

  cy.get(`[data-cy="cy-section-value-${MQ_DETAILS.name + "1"}"]`).should(
    "exist",
  );

  // Address
  cy.get('[data-cy="cy-organisation-value-APPLICANT_ORG_ADDRESS"]')
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        MQ_DETAILS.address[index] + (index < 4 ? "," : ""),
      );
    });
  cy.get(
    '[data-cy="cy-section-details-navigation-APPLICANT_ORG_ADDRESS"]',
  ).click();
  ["addressLine1", "addressLine2", "city", "county", "postcode"].forEach(
    (item, index) => {
      cy.get(`[data-cy=cy-${item}-text-input]`)
        .should("have.value", MQ_DETAILS.address[index])
        .clear()
        .type(MQ_DETAILS.address[index] + "1");
    },
  );
  clickSaveAndContinue();
  cy.get('[data-cy="cy-organisation-value-APPLICANT_ORG_ADDRESS"]')
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        MQ_DETAILS.address[index] + "1" + (index < 4 ? "," : ""),
      );
    });

  // Charities Commission
  cy.get(
    `[data-cy="cy-section-value-${MQ_DETAILS.charitiesCommission}"]`,
  ).should("exist");

  cy.get(
    '[data-cy="cy-section-details-navigation-APPLICANT_ORG_CHARITY_NUMBER"]',
  ).click();
  cy.get("[data-cy=cy-charityCommissionNumber-text-input]")
    .should("have.value", MQ_DETAILS.charitiesCommission)
    .clear()
    .type(MQ_DETAILS.charitiesCommission + "1");
  clickSaveAndContinue();

  cy.get(
    `[data-cy="cy-section-value-${MQ_DETAILS.charitiesCommission + "1"}"]`,
  ).should("exist");

  // Companies House
  cy.get(`[data-cy="cy-section-value-${MQ_DETAILS.companiesHouse}"]`).should(
    "exist",
  );

  cy.get(
    '[data-cy="cy-section-details-navigation-APPLICANT_ORG_COMPANIES_HOUSE"]',
  ).click();
  cy.get("[data-cy=cy-companiesHouseNumber-text-input]")
    .should("have.value", MQ_DETAILS.companiesHouse)
    .clear()
    .type(MQ_DETAILS.companiesHouse + "1");
  clickSaveAndContinue();

  cy.get(
    `[data-cy="cy-section-value-${MQ_DETAILS.companiesHouse + "1"}"]`,
  ).should("exist");

  // Complete section & move to funding
  cy.get('[data-cy="cy-radioInput-option-YesIveCompletedThisSection"]').click();
  clickSaveAndContinue();
  cy.get('[data-cy="cy-section-title-link-Funding"]').click();

  // Check, Change & Check the details

  // Funding amount
  cy.get(`[data-cy="cy-section-value-${MQ_DETAILS.howMuchFunding}"]`).should(
    "exist",
  );

  cy.get('[data-cy="cy-section-details-navigation-APPLICANT_AMOUNT"]').click();
  cy.contains("How much funding are you applying for?");
  cy.get("[data-cy=cy-fundingAmount-text-input-numeric]")
    .should("have.value", MQ_DETAILS.howMuchFunding)
    .clear()
    .type(MQ_DETAILS.howMuchFunding + "1");
  clickSaveAndContinue();

  cy.get(
    `[data-cy="cy-section-value-${MQ_DETAILS.howMuchFunding + "1"}"]`,
  ).should("exist");

  // Funding locations
  cy.get('[data-cy="cy-organisation-value-BENEFITIARY_LOCATION"]')
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        MQ_DETAILS.fundingLocation[index] + (index < 12 ? "," : ""),
      );
    });

  cy.get(
    '[data-cy="cy-section-details-navigation-BENEFITIARY_LOCATION"]',
  ).click();
  cy.contains("Where will this funding be spent?").should("exist");
  MQ_DETAILS.fundingLocation.forEach((item) => {
    // cy.get('[data-cy="cy-checkbox-value-North East England"]')
    cy.get(`[data-cy="cy-checkbox-value-${item}"]`).click();
  });
  cy.get(
    `[data-cy="cy-checkbox-value-${MQ_DETAILS.fundingLocation[0]}"]`,
  ).click();
  clickSaveAndContinue();

  cy.get('[data-cy="cy-organisation-value-BENEFITIARY_LOCATION"]').contains(
    MQ_DETAILS.fundingLocation[0],
  );

  // Complete the section
  cy.get('[data-cy="cy-radioInput-option-YesIveCompletedThisSection"]').click();
  clickSaveAndContinue();
};

const confirmDetailsOnSummaryScreen = () => {
  // Confirm your details

  // Name
  cy.get('[data-cy="cy-organisation-value-Name"]').contains(MQ_DETAILS.name);

  // Address
  cy.get("[data-cy=cy-organisation-value-Address]")
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        MQ_DETAILS.address[index] + (index < 4 ? "," : ""),
      );
    });

  // Org Type
  cy.get('[data-cy="cy-organisation-value-Type of organisation"]').contains(
    MQ_DETAILS.orgType,
  );

  // Companies House
  cy.get('[data-cy="cy-organisation-value-Companies House number"]').contains(
    MQ_DETAILS.companiesHouse,
  );

  // Charities Commission
  cy.get(
    '[data-cy="cy-organisation-value-Charity Commission number"]',
  ).contains(MQ_DETAILS.charitiesCommission);

  // How much funding
  cy.get(
    '[data-cy="cy-organisation-value-How much funding are you applying for?"]',
  ).contains(`£ ${MQ_DETAILS.howMuchFunding}`);

  // Funding locations
  cy.get(
    '[data-cy="cy-organisation-value-Where will this funding be spent?"] > .govuk-list',
  )
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        MQ_DETAILS.fundingLocation[index] +
          (index < MQ_DETAILS.fundingLocation.length - 1 ? "," : ""),
      );
    });
};

const confirmOrgAndFundingDetails = (suffix, orgType, fundingLocations) => {
  // Check Org Details Match
  cy.get('[data-cy="cy-section-title-link-Your organisation"]').click();
  cy.get('[data-cy="cy-manage-section-header"]').contains("Your organisation");

  cy.get(`[data-cy="cy-section-value-${MQ_DETAILS.name + suffix}"]`).should(
    "exist",
  );
  cy.get(`[data-cy="cy-section-value-${orgType}"]`).should("exist");
  cy.get('[data-cy="cy-organisation-value-APPLICANT_ORG_ADDRESS"]')
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        MQ_DETAILS.address[index] + suffix + (index < 4 ? "," : ""),
      );
    });
  cy.get(
    `[data-cy="cy-section-value-${MQ_DETAILS.companiesHouse + suffix}"]`,
  ).should("exist");
  cy.get(
    `[data-cy="cy-section-value-${MQ_DETAILS.charitiesCommission + suffix}"]`,
  ).should("exist");

  cy.get('[data-cy="cy-isComplete-question-title"]').contains(
    "Have you completed this section?",
  );
  cy.get('[data-cy="cy-radioInput-option-YesIveCompletedThisSection"]').click();
  clickSaveAndContinue();
  cy.get('[data-cy="cy-status-tag-Your organisation-Completed"]').should(
    "exist",
  );

  // Check Funding Details Match
  cy.get('[data-cy="cy-status-tag-Funding-In Progress"]').should("exist");
  cy.get('[data-cy="cy-section-title-link-Funding"]').click();
  cy.get('[data-cy="cy-section-title-link-Funding"]').contains("Funding");

  cy.get(
    `[data-cy="cy-section-value-${MQ_DETAILS.howMuchFunding + suffix}"]`,
  ).should("exist");
  cy.get('[data-cy="cy-organisation-value-BENEFITIARY_LOCATION"] > .govuk-list')
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        MQ_DETAILS.fundingLocation[index] +
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

  it("Mandatory Questions Flow - Empty & Filled Organisation Profile", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

    // Sign in
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant();

    // 1. EMPTY ORG PROFILE
    /*
    Test Coverage:
    - Internal Application
    - Empty Org Profile
    - Complete E&D Questions
    */

    // Search & Start internal application
    cy.get('[data-cy="cy-find-a-grant-link"]').click();
    searchForGrant(Cypress.env("testV2InternalGrant").advertName);
    cy.contains(Cypress.env("testV2InternalGrant").advertName).click();
    cy.contains("Start new application").invoke("removeAttr", "target").click();

    // Before you start
    cy.contains("Before you start");
    cy.contains("Continue").click();

    // Mandatory Questions & Confirm Details
    fillMandatoryQuestions(false, MQ_DETAILS);
    cy.contains("Confirm your details");
    confirmDetailsOnSummaryScreen(true, true);

    // Click through and edit fields
    editDetailsOnSummaryScreen();

    // Confirm and submit application
    clickText("Confirm and submit");

    // Check page is loaded
    cy.get(
      '[data-cy="cy-application-name-Cypress - Test Application V2 Internal"]',
    ).should("exist");
    cy.get('[data-cy="cy-application-header"]').should("exist");

    // Check status of tasks - Pre Eligibility
    cy.get('[data-cy="cy-status-tag-Eligibility-Not Started"]').should("exist");
    cy.get(
      '[data-cy="cy-status-tag-Your organisation-Cannot Start Yet"]',
    ).should("exist");
    cy.get('[data-cy="cy-status-tag-Funding-Cannot Start Yet"]').should(
      "exist",
    );

    fillOutEligibity();

    // Check status of tasks - Post Eligibility
    cy.get('[data-cy="cy-status-tag-Eligibility-Completed"]').should("exist");
    cy.get('[data-cy="cy-status-tag-Your organisation-In Progress"]').should(
      "exist",
    );
    cy.get('[data-cy="cy-status-tag-Funding-In Progress"]').should("exist");

    // Confirm Org & Funding Details and Submit
    confirmOrgAndFundingDetails("1", "Charity", ["North East (England)"]);
    submitApplication();

    // Fill E&D Questions and return to dashboard
    equalitySectionAccept();
    clickText("View your applications");
    clickText("Back");

    // 2. FILLED ORG PROFILE
    /*
    Test Coverage:
    - External Application
    - Full Org Profile
    */

    // Refill Org Profile
    fillOrgProfile();

    // Search & Start external application
    cy.get('[data-cy="cySearch grantsPageLink"] > .govuk-link').click();
    cy.get('[data-cy="cySearchAgainInput"]').type(
      Cypress.env("testV2ExternalGrant").advertName,
    );
    cy.get('[data-cy="cySearchAgainButton"]').click();

    cy.contains(Cypress.env("testV2ExternalGrant").advertName).click();
    cy.contains("Start new application").invoke("removeAttr", "target").click();

    // Mandatory Questions Journey - Straight to Funding Details
    cy.contains("Before you start");
    cy.contains("Continue").click();

    fillMandatoryQuestions(true, MQ_DETAILS);
    confirmDetailsOnSummaryScreen(true, true);

    // Confirm and submit application
    clickText("Confirm and submit");

    // Now leaving page
    cy.contains("You are now leaving GOV.UK");
    cy.get('[data-cy="cy-apply-external-application-button"]')
      .invoke("attr", "href")
      .should("eq", Cypress.env("testV2ExternalGrant").applicationUrl);
    clickText("Continue to application form");
  });

  it("Mandatory Questions Flow - Partially Filled Org Profile", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

    // Sign in
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant();

    /*
    Test Coverage:
    - Internal Application
    - Partially Filled Org Profile
    - Edit on Org Details and Funding Details
    - Skip E&D Questions
    */

    // Partially fill org profile
    partialFillOrgProfile();

    // Search & Start new application
    cy.get('[data-cy="cySearch grantsPageLink"] > .govuk-link').click();
    cy.get('[data-cy="cySearchAgainInput"]').type(
      Cypress.env("testV2InternalGrant").advertName,
    );
    cy.get('[data-cy="cySearchAgainButton"]').click();

    cy.contains(Cypress.env("testV2InternalGrant").advertName).click();
    cy.contains("Start new application").invoke("removeAttr", "target").click();

    // Before you start
    cy.contains("Before you start");
    cy.contains("Continue").click();

    // Org Type - should be filled
    cy.get('[data-cy="cy-radioInput-option-LimitedCompany"]').should(
      "be.checked",
    );
    clickSaveAndContinue();

    // Name - Should be empty
    cy.get('[data-cy="cy-name-text-input"]')
      .should("be.empty")
      .type(MQ_DETAILS.name);
    clickSaveAndContinue();

    // Address - should be full
    ["addressLine1", "addressLine2", "city", "county", "postcode"].forEach(
      (item, index) => {
        cy.get(`[data-cy="cy-${item}-text-input"]`).should(
          "have.value",
          MQ_DETAILS.address[index],
        );
      },
    );
    clickSaveAndContinue();

    // Companies House - should be empty
    cy.get('[data-cy="cy-companiesHouseNumber-text-input"]')
      .should("be.empty")
      .type(MQ_DETAILS.companiesHouse);
    clickSaveAndContinue();

    // Charities Commission - Should be filled
    cy.get('[data-cy="cy-charityCommissionNumber-text-input"]').should(
      "have.value",
      MQ_DETAILS.charitiesCommission,
    );
    clickSaveAndContinue();

    // Complete rest of MQ journey
    fillMandatoryQuestions(true, MQ_DETAILS);
    confirmDetailsOnSummaryScreen();
    clickText("Confirm and submit");

    cy.get('[data-cy="cyAccount detailsPageLink"] > .govuk-link').click();
    cy.get('[data-cy="cy-link-card-Your saved information"]').click();

    cy.get('[data-cy="cy-organisation-value-Type of organisation"]').contains(
      MQ_DETAILS.orgType,
    );
    cy.get("[data-cy=cy-organisation-value-Address]")
      .find("ul")
      .children("li")
      .each((listItem, index) => {
        cy.wrap(listItem).contains(
          MQ_DETAILS.address[index] + (index < 4 ? "," : ""),
        );
      });

    cy.get('[data-cy="cy-organisation-value-Companies house number"]').contains(
      MQ_DETAILS.companiesHouse,
    );
    cy.get(
      '[data-cy="cy-organisation-value-Charity commission number"]',
    ).contains(MQ_DETAILS.charitiesCommission);

    cy.get('[data-cy="cy-back-to-dashboard-button"]').click();

    cy.get('[data-cy="cy-your-applications-link"]').click();
    cy.get(
      '[data-cy="cy-application-link-Cypress - Test Application V2 Internal"]',
    ).click();

    // Complete & Submit application
    fillOutEligibity();
    editOrgAndFundingDetails();

    // Submit & skip E&D questions and return to dashboard
    submitApplication();
    equalitySectionDecline();
    clickText("View your applications");
    clickText("Back");
  });
});
