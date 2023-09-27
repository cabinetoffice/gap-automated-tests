import {
  signInWithOneLogin,
  saveAndContinue,
  yesSectionComplete,
  signInToIntegrationSite,
  save,
} from "../../common/common";

const fillOutRequiredChecks = () => {
  cy.contains("Required checks").click();

  cy.contains("Enter the name of your organisation");
  cy.get("[data-cy=cy-APPLICANT_ORG_NAME-text-input").type("My First Org");
  saveAndContinue();

  cy.contains("Choose your organisation type");
  cy.get("[data-cy=cy-APPLICANT_TYPE-select]").should("have.value", "");
  cy.get("[data-cy=cy-APPLICANT_TYPE-select]").select("Limited company");
  cy.get("[data-cy=cy-APPLICANT_TYPE-select]").should(
    "have.value",
    "Limited company",
  );
  saveAndContinue();

  cy.contains("Enter your organisation's address");
  cy.get("[data-cy=cy-APPLICANT_ORG_ADDRESS-address-line-1-text-input").type(
    "Address line 1",
  );
  cy.get("[data-cy=cy-APPLICANT_ORG_ADDRESS-address-line-2-text-input").type(
    "Address line 2",
  );
  cy.get("[data-cy=cy-APPLICANT_ORG_ADDRESS-town-text-input").type("Town");
  cy.get("[data-cy=cy-APPLICANT_ORG_ADDRESS-county-text-input").type("County");
  cy.get("[data-cy=cy-APPLICANT_ORG_ADDRESS-postcode-text-input").type(
    "Postcode",
  );
  saveAndContinue();

  cy.contains(
    "Enter your Charity Commission number (if you have one) (optional)",
  );
  saveAndContinue();

  cy.contains("Enter your Companies House number (if you have one) (optional)");
  saveAndContinue();

  cy.contains("How much does your organisation require as a grant?");
  cy.contains("Please enter whole pounds only");
  cy.get("[data-cy=cy-APPLICANT_AMOUNT-text-input-numeric").type("100");
  saveAndContinue();

  cy.contains("Where will this funding be spent?");
  cy.contains(
    "Select the location where the grant funding will be spent. You can choose more than one, if it is being spent in more than one location.",
  );
  cy.get('[type="checkbox"]').not("[disabled]").check().should("be.checked");
  saveAndContinue();

  cy.contains("Summary of Required checks");
  cy.get("[data-cy=cy-section-details-APPLICANT_ORG_NAME]").contains(
    "Enter the name of your organisation",
  );
  cy.contains("My First Org");
  cy.get("[data-cy=cy-section-details-APPLICANT_TYPE]").contains(
    "Choose your organisation type",
  );
  cy.contains("Limited company");
  cy.get("[data-cy=cy-section-details-APPLICANT_ORG_ADDRESS]").contains(
    "Enter your organisation's address",
  );
  cy.get("[data-cy=cy-organisation-value-APPLICANT_ORG_ADDRESS] > ul > li")
    .should("contain", "Address line 1,")
    .and("contain", "Address line 2,")
    .and("contain", "Town,")
    .and("contain", "County,")
    .and("contain", "Postcode");
  cy.get("[data-cy=cy-section-details-APPLICANT_ORG_CHARITY_NUMBER]").contains(
    "Enter your Charity Commission number (if you have one) (optional)",
  );
  cy.get("[data-cy=cy-section-details-APPLICANT_ORG_COMPANIES_HOUSE]").contains(
    "Enter your Companies House number (if you have one) (optional)",
  );
  cy.get("[data-cy=cy-section-details-APPLICANT_AMOUNT]").contains(
    "How much does your organisation require as a grant?",
  );
  cy.contains("100");
  cy.get("[data-cy=cy-section-details-BENEFITIARY_LOCATION]").contains(
    "Where will this funding be spent?",
  );
  cy.get("[data-cy=cy-organisation-value-BENEFITIARY_LOCATION] > ul > li")
    .should("contain", "North East England,")
    .and("contain", "North West England,")
    .and("contain", "South East England,")
    .and("contain", "South West England,")
    .and("contain", "Midlands,")
    .and("contain", "Scotland,")
    .and("contain", "Wales,")
    .and("contain", "Northern Ireland");

  yesSectionComplete();
};

const submitApplication = () => {
  cy.contains("Submit application").click();

  cy.contains("Are you sure you want to submit this application?");
  cy.contains(
    "You will not be able to make changes to your application after this has been submitted.",
  );
  cy.contains("Yes, submit this application").click();
};

const equalitySectionDecline = () => {
  cy.contains("We have received your application");
  cy.contains(
    "Before you finish using the service, we’d like to ask some equality questions.",
  );
  cy.contains("Do you want to answer the equality questions?");
  cy.contains(
    "These questions are optional. We would like to understand who the grant will benefit.",
  );
  cy.contains("Your answers will not affect your application.");
  cy.get("[data-cy=cy-radioInput-option-NoSkipTheEqualityQuestions]").click();
  cy.contains("Continue").click();
};

describe("Find a Grant", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("loads the page", () => {
    cy.contains("Find a grant");
  });

  it("can search for a grant", () => {
    cy.get('[name="searchTerm"]')
      .should("have.attr", "placeholder")
      .should("contains", "enter a keyword or search term here");
    cy.get('[name="searchTerm"]').type("Cypress");

    cy.get("[data-cy=cySearchGrantsBtn]").click();

    cy.contains("Cypress - Automated E2E Test Grant").click();

    const grantData = {
      Location: "National",
      "Funding organisation": "The Department of Business",
      "Who can apply": "Non-profit",
      "How much you can get": "From £1 to £10,000",
      "Total size of grant scheme": "£1 million",
      "Opening date": "24 August 2023, 12:01am",
      "Closing date": "24 October 2040, 11:59pm",
    };
    Object.entries(grantData).forEach(([key, value]) => {
      cy.contains(key);
      cy.contains(value);
    });
  });

  it("can start and submit new grant application", () => {
    cy.get('[name="searchTerm"]')
      .should("have.attr", "placeholder")
      .should("contains", "enter a keyword or search term here");
    cy.get('[name="searchTerm"]').type("Cypress");

    cy.get("[data-cy=cySearchGrantsBtn]").click();

    cy.contains("Cypress - Automated E2E Test Grant").click();

    cy.contains("Start new application").invoke("removeAttr", "target").click();

    signInWithOneLogin(
      Cypress.env("oneLoginApplicantEmail"),
      Cypress.env("oneLoginApplicantPassword"),
    );

    // cy.visit(
    //   "https://sandbox-gap.service.cabinetoffice.gov.uk/apply/applicant/applications/-1",
    // );

    cy.contains("Eligibility").click();
    cy.contains("no");
    cy.get("[data-cy=cy-radioInput-option-Yes]").click();
    saveAndContinue();
    yesSectionComplete();

    fillOutRequiredChecks();

    submitApplication();

    equalitySectionDecline();

    cy.contains("Application submitted");
    cy.contains("What happens next");
    cy.contains(
      "The funding organisation will contact you once they have reviewed your application.",
    );
    cy.contains("View your applications").click();
  });

  it("can land on application dashboard and view details", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();

    signInWithOneLogin(
      Cypress.env("oneLoginApplicantEmail"),
      Cypress.env("oneLoginApplicantPassword"),
    );

    cy.contains("Your organisation details").click();

    cy.get(
      "[data-cy=cy-organisation-details-navigation-organisationName]",
    ).click();
    cy.get("[data-cy=cy-legalName-text-input]").type("Cypress Test Org Name");
    save();

    // cy.get("[data-cy=cy-organisation-details-navigation-organisationAddress]").click();
    // cy.get("[data-cy=cy-legalName-text-input]").type("Cypress Test Org Name");
    // save();
    //
    // cy.get("[data-cy=cy-organisation-details-navigation-organisationType]").click();
    // cy.get("[data-cy=cy-legalName-text-input]").type("Cypress Test Org Name");
    // save();
    //
    // cy.get("[data-cy=cy-organisation-details-navigation-organisationCompaniesHouseNumber]").click();
    // cy.get("[data-cy=cy-legalName-text-input]").type("Cypress Test Org Name");
    // save();
    //
    // cy.get("[data-cy=cy-organisation-details-navigation-organisationCharity]").click();
    // cy.get("[data-cy=cy-legalName-text-input]").type("Cypress Test Org Name");
    // save();

    cy.contains("Back to my account").click();

    cy.contains("Your sign in details").click();

    // TODO reenable click when MFA strategy is defined
    cy.contains("Change your sign in details in your GOV.UK One Login");
    //.click();

    // cy.origin("https://signin.integration.account.gov.uk", () => {
    //   cy.contains("Enter the 6 digit security code");
    // });
  });

  it("can land on application dashboard and view details", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();

    //signInWithOneLogin();
  });
});
