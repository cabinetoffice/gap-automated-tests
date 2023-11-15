import {
  clickSaveAndContinue,
  clickSaveAndExit,
  yesSectionComplete,
  signInToIntegrationSite,
  clickSave,
  searchForGrant,
  signInAsApplyApplicant,
  clickContinue,
  signOut,
  clickBack,
  POST_LOGIN_BASE_URL,
} from "../../common/common";

const fillOutDocUpload = () => {
  cy.get('[data-testid="file-upload-input"]').as("fileInput");
  cy.fixture("example.doc").then((fileContent) => {
    cy.get("@fileInput").attachFile({
      fileContent: fileContent.toString(),
      fileName: "example.doc",
      mimeType: "application/msword",
    });
  });
  clickSaveAndContinue();
};

const fillOutCustomSection = () => {
  cy.get('[data-cy="cy-status-tag-Custom Section-Not Started"]');
  cy.get('[data-cy="cy-section-title-link-Custom Section"]').click();

  // Error when trying to skip mandatory question
  clickSaveAndContinue();
  cy.get('[data-cy="cyErrorBanner"]').contains("There is a problem");

  // Saving and exiting after filling out a question
  cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
  clickSaveAndExit();
  cy.get('[data-cy="cy-status-tag-Custom Section-In Progress"]');
  cy.get('[data-cy="cy-section-title-link-Custom Section"]').click();
  clickSaveAndContinue();

  const shortAnswerQuestionId = "8c4bf8f9-e175-4bd8-a54f-3d9587767bca";
  cy.get('[data-cy="cy-' + shortAnswerQuestionId + '-text-input"]').type(
    "input 1",
  );
  clickSaveAndContinue();

  const textAreaQuestionId = "d864dc12-d12c-411c-9e2f-8097fa8c5b90";
  cy.get('[data-cy="cy-' + textAreaQuestionId + '-text-area"]').type("input 2");
  clickSaveAndContinue();

  const multiSelectQuestionId = "0f0f03e1-9636-4d0d-bd98-e72690307156";
  cy.get('[data-cy="cy-' + multiSelectQuestionId + '-select"]').select(
    "Choice 1",
  );
  clickSaveAndContinue();

  cy.get('[data-cy="cy-checkbox-value-Choice 1"]').click();
  cy.get('[data-cy="cy-checkbox-value-Choice 2"]').click();
  clickSaveAndContinue();

  fillOutDocUpload();

  const dateQuestionId = "e228a74a-290c-4b60-b4c1-d20b138ae10d";
  cy.get('[data-cy="cyDateFilter-' + dateQuestionId + 'Day"]').type("01");
  cy.get('[data-cy="cyDateFilter-' + dateQuestionId + 'Month"]').type("01");
  cy.get('[data-cy="cyDateFilter-' + dateQuestionId + 'Year"]').type("2000");
  clickSaveAndContinue();

  yesSectionComplete();

  cy.get('[data-cy="cy-status-tag-Custom Section-Completed"]');
};

const fillOutEligibity = () => {
  cy.get('[data-cy="cy-status-tag-Eligibility-Not Started"]');
  cy.contains("Eligibility").click();
  cy.contains("no");
  cy.get("[data-cy=cy-radioInput-option-Yes]").click();
  clickSaveAndContinue();
  yesSectionComplete();
  cy.get('[data-cy="cy-status-tag-Eligibility-Completed"]');
};

const fillOutRequiredChecks = () => {
  cy.get('[data-cy="cy-status-tag-Required checks-Not Started"]');
  cy.contains("Required checks").click();

  cy.contains("Enter the name of your organisation");
  cy.get("[data-cy=cy-APPLICANT_ORG_NAME-text-input").type("My First Org");
  clickSaveAndContinue();

  cy.contains("Choose your organisation type");
  cy.get("[data-cy=cy-APPLICANT_TYPE-select]").should("have.value", "");
  cy.get("[data-cy=cy-APPLICANT_TYPE-select]").select("Limited company");
  cy.get("[data-cy=cy-APPLICANT_TYPE-select]").should(
    "have.value",
    "Limited company",
  );
  clickSaveAndContinue();

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
  clickSaveAndContinue();

  cy.contains(
    "Enter your Charity Commission number (if you have one) (optional)",
  );
  clickSaveAndContinue();

  cy.contains("Enter your Companies House number (if you have one) (optional)");
  clickSaveAndContinue();

  cy.contains("How much does your organisation require as a grant?");
  cy.contains("Please enter whole pounds only");
  cy.get("[data-cy=cy-APPLICANT_AMOUNT-text-input-numeric").type("100");
  clickSaveAndContinue();

  cy.contains("Where will this funding be spent?");
  cy.contains(
    "Select the location where the grant funding will be spent. You can choose more than one, if it is being spent in more than one location.",
  );
  cy.get('[type="checkbox"]').not("[disabled]").check().should("be.checked");
  clickSaveAndContinue();

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

  cy.get('[data-cy="cy-status-tag-Required checks-Completed"]');
};

const submitApplication = () => {
  cy.contains("Submit application").click();

  cy.contains("Are you sure you want to submit this application?");
  cy.contains(
    "You will not be able to make changes to your application after this has been submitted.",
  );
  cy.contains("Yes, submit this application").click();
};

const equalitySectionAccept = () => {
  cy.contains("We have received your application");
  cy.contains(
    "Before you finish using the service, we’d like to ask some equality questions.",
  );
  cy.contains("Do you want to answer the equality questions?");
  cy.contains(
    "These questions are optional. We would like to understand who the grant will benefit.",
  );
  cy.contains("Your answers will not affect your application.");
  cy.get(
    '[data-cy="cy-radioInput-option-YesAnswerTheEqualityQuestionsTakes2Minutes"]',
  ).click();
  clickContinue();

  cy.contains("Which of these options best describes your organisation?");
  cy.get(
    '[data-cy="cy-radioInput-option-VoluntaryCommunityOrSocialEnterpriseVcse"]',
  ).click();
  clickContinue();

  cy.contains(
    "Does your organisation primarily focus on supporting a particular sex?",
  );
  cy.get('[data-cy="cy-radioInput-option-NoWeSupportBothSexes"]').click();
  clickContinue();

  cy.contains(
    "Does your organisation primarily focus on supporting a particular age group?",
  );
  cy.get('[data-cy="cy-checkbox-value-25 to 54 year olds"]').click();
  cy.get('[data-cy="cy-checkbox-value-55 to 64 year olds"]').click();
  clickContinue();

  cy.contains(
    "Does your organisation primarily focus on supporting a particular ethnic group?",
  );
  cy.get(
    '[data-cy="cy-radioInput-option-MixedOrMultipleEthnicGroups"]',
  ).click();
  clickContinue();

  cy.contains(
    "Does your organisation primarily focus on supporting people with mental or physical disabilities?",
  );
  cy.get('[data-cy="cy-radioInput-option-Yes"]').click();
  clickContinue();

  cy.contains(
    "Does you organisation primarily focus on supporting a particular sexual orientation?",
  );
  cy.get(
    '[data-cy="cy-checkbox-value-No, we support people of any sexual orientation"]',
  ).click();
  clickContinue();

  cy.contains("Which of these options best describes your organisation?");
  cy.contains("Voluntary, community, or social enterprise (VCSE)");
  cy.contains(
    "Does your organisation primarily focus on supporting a particular sex?",
  );
  cy.contains("No, we support both sexes");
  cy.contains(
    "Does your organisation primarily focus on supporting a particular age group?",
  );
  cy.contains("25 to 54 year olds, 55 to 64 year olds");
  cy.contains(
    "Does your organisation primarily focus on supporting a particular ethnic group?",
  );
  cy.contains("Mixed or multiple ethnic groups");
  cy.contains(
    "Does your organisation primarily focus on supporting people with mental or physical disabilities?",
  );
  cy.contains("Yes");
  cy.contains(
    "Does you organisation primarily focus on supporting a particular sexual orientation?",
  );
  cy.contains("No, we support people of any sexual orientation");

  clickSaveAndContinue();

  cy.contains("Your answers have been submitted");
  cy.contains("Thank you");
  cy.contains("Thanks for helping us understand who the grant will benefit.");
  cy.contains("Your answers will not affect your application.");
  cy.contains(
    "The funding organisation will contact you once they have reviewed your application.",
  );
};

// const equalitySectionDecline = () => {
//   cy.contains("We have received your application");
//   cy.contains(
//     "Before you finish using the service, we’d like to ask some equality questions.",
//   );
//   cy.contains("Do you want to answer the equality questions?");
//   cy.contains(
//     "These questions are optional. We would like to understand who the grant will benefit.",
//   );
//   cy.contains("Your answers will not affect your application.");
//   cy.get("[data-cy=cy-radioInput-option-NoSkipTheEqualityQuestions]").click();
//   clickContinue();
//
//   cy.contains("Application submitted");
//   cy.contains("What happens next");
//   cy.contains(
//     "The funding organisation will contact you once they have reviewed your application.",
//   );
// };

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
  [
    "North East England (England)",
    "North West (England)",
    "Yorkshire and The Humber",
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
  ].forEach((item) => {
    cy.get(`data-cy="cy-checkbox-value-${item}"]`)
      .should("not.be.checked")
      .click();
  });
  clickSaveAndContinue();
};

const confirmDetails = (details) => {
  // Confirm your details
  cy.contains("Confirm your details").should("exist");

  cy.contains(details.name).should("exist");

  cy.get("[data-cy=cy-organisation-value-Address]")
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).should(
        "have.text",
        details.address[index] + (index < 4 ? "," : ""),
      );
    });

  cy.contains(details.orgType).should("exist");
  cy.contains(details.companiesHouse).should("exist");
  cy.contains(details.charitiesCommission).should("exist");
  cy.contains(`£${details.howMuchFunding}`).should("exist");

  cy.get("[data-cy=cy-organisation-value-Where will this funding be spent?]")
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).should(
        "have.text",
        details.fundingLocation[index] + (index < 12 ? "," : ""),
      );
    });
};

describe("Apply for a Grant", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("can start, save, come back, continue and submit new grant application", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

    searchForGrant(Cypress.env("testV1Grant").name);

    cy.contains(Cypress.env("testV1Grant").name).click();

    cy.contains("Start new application").invoke("removeAttr", "target").click();

    signInAsApplyApplicant();

    // TODO fix this, we shouldn't need to manually navigate
    cy.visit(Cypress.env("testV1Grant").applicationUrl);

    // checks 'mailto' support email link
    cy.get('[data-cy="cy-support-email"]').should(
      "have.attr",
      "href",
      `mailto:${Cypress.env("oneLoginAdminEmail")}`,
    );

    fillOutEligibity();

    // test sign out and back in
    cy.contains("Save and come back later").click();

    signOut();

    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsApplyApplicant();

    cy.get('[data-cy="cy-your-applications-link"]').click();
    cy.contains(Cypress.env("testV1Grant").applicationName).click();

    cy.get('[data-cy="cy-status-tag-Eligibility-Completed"]');

    fillOutRequiredChecks();

    fillOutCustomSection();

    cy.get('[data-cy="cy-status-tag-Eligibility-Completed"]');
    cy.get('[data-cy="cy-status-tag-Required checks-Completed"]');
    cy.get('[data-cy="cy-status-tag-Custom Section-Completed"]');

    // test doc upload is required
    cy.contains("Submit application").should("not.be.disabled");

    cy.contains("Custom Section").click();

    clickSaveAndContinue();
    clickSaveAndContinue();
    clickSaveAndContinue();
    clickSaveAndContinue();
    clickSaveAndContinue();

    cy.contains("Custom Question 6");
    cy.contains("Uploaded File");
    cy.contains("example.doc");
    cy.contains("Remove File").click();
    cy.get('[data-testid="file-upload-input"]');

    clickBack();
    clickBack();
    clickBack();
    clickBack();
    clickBack();
    clickBack();

    cy.contains("Your Application");

    cy.get('[data-cy="cy-status-tag-Custom Section-In Progress"]');

    cy.contains("Submit application").should("be.disabled");

    // re-add doc upload
    cy.get('[data-cy="cy-section-title-link-Custom Section"]').click();

    clickSaveAndContinue();
    clickSaveAndContinue();
    clickSaveAndContinue();
    clickSaveAndContinue();
    clickSaveAndContinue();

    fillOutDocUpload();

    clickSaveAndContinue();
    yesSectionComplete();
    cy.get('[data-cy="cy-status-tag-Custom Section-Completed"]');

    cy.contains("Submit application").should("not.be.disabled");

    // submit
    submitApplication();

    equalitySectionAccept();

    cy.contains("View your applications").click();

    cy.contains("Your applications");
    cy.contains("All of your current and past applications are listed below.");
    cy.contains("Name of grant");
    cy.contains(Cypress.env("testV1Grant").applicationName);

    // checks that clicking on submitted application does nothing
    cy.get(
      `[data-cy="cy-application-link-${
        Cypress.env("testV1Grant").applicationName
      }"]`,
    ).should("not.have.attr", "href");
  });

  it("can land on application dashboard and view details", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();

    signInAsApplyApplicant();

    cy.contains("Your organisation details").click();

    cy.get(
      "[data-cy=cy-organisation-details-navigation-organisationName]",
    ).click();
    cy.get("[data-cy=cy-legalName-text-input]").type("Organisation Name");
    clickSave();
    cy.get("[data-cy=cy-organisation-value-Name]").should(
      "have.text",
      "Organisation Name",
    );

    const addressData = [
      "Address line 1",
      "Address line 2",
      "Town",
      "County",
      "Postcode",
    ];
    cy.get(
      "[data-cy=cy-organisation-details-navigation-organisationAddress]",
    ).click();
    cy.get("[data-cy=cy-addressLine1-text-input]").type(addressData[0]);
    cy.get("[data-cy=cy-addressLine2-text-input]").type(addressData[1]);
    cy.get("[data-cy=cy-town-text-input").type(addressData[2]);
    cy.get("[data-cy=cy-county-text-input").type(addressData[3]);
    cy.get("[data-cy=cy-postcode-text-input").type(addressData[4]);
    clickSave();
    cy.get("[data-cy=cy-organisation-value-Address]")
      .find("ul")
      .children("li")
      .each((listItem, index) => {
        cy.wrap(listItem).should(
          "have.text",
          addressData[index] + (index < 4 ? "," : ""),
        );
      });

    cy.get(
      "[data-cy=cy-organisation-details-navigation-organisationType]",
    ).click();
    cy.get("[data-cy=cy-radioInput-option-Other]").click();
    cy.get("[data-cy=cy-radioInput-option-IAmApplyingAsAnIndividual]").click();
    cy.get("[data-cy=cy-radioInput-option-Charity]").click();
    cy.get("[data-cy=cy-radioInput-option-NonLimitedCompany]").click();
    cy.get("[data-cy=cy-radioInput-option-LimitedCompany]").click();
    clickSave();
    cy.contains("Limited company").should("exist");

    cy.get(
      "[data-cy=cy-organisation-details-navigation-organisationCompaniesHouseNumber]",
    ).click();
    cy.get("[data-cy=cy-companiesHouseNumber-text-input]").type("01234");
    clickSave();
    cy.contains("01234").should("exist");

    cy.get(
      "[data-cy=cy-organisation-details-navigation-organisationCharity]",
    ).click();
    cy.get("[data-cy=cy-charityCommissionNumber-text-input]").type("56789");
    clickSave();
    cy.contains("56789").should("exist");

    cy.contains("Back to my account").click();

    cy.get("[data-cy=cy-find-a-grant-link").click();
    cy.get("[data-cy=cyHomePageTitle]").should("have.text", "Find a grant");
    cy.go("back");

    ["/apply/admin/dashboard", "/apply/admin/super-admin-dashboard"].forEach(
      (page) => {
        cy.visit(`${POST_LOGIN_BASE_URL}${page}`, { failOnStatusCode: false })
          .contains("Page not found")
          .should("exist");
        cy.go("back");
      },
    );

    cy.contains("Your sign in details").click();

    // TODO reenable click when MFA strategy is defined
    cy.contains("Change your sign in details in your GOV.UK One Login");
    // .click();

    // cy.origin(Cypress.env('oneLoginBaseUrl'), () => {
    //   cy.contains("Enter the 6 digit security code");
    // });
  });
  // cy.origin("https://signin.integration.account.gov.uk", () => {
  //   cy.contains("Enter the 6 digit security code");
  // });

  it(
    "Mandatory questions flow - Empty organisation profile",
    {
      retries: {
        runMode: 1,
        openMode: 0,
      },
    },
    () => {
      cy.task("publishGrantsToContentful");
      // wait for grant to be published to contentful
      cy.wait(5000);

      // TODO - Get working with Cypress grant
      searchForGrant("V2 - 06/11");
      cy.contains("V2 - 06/11").click();

      cy.contains("Start new application")
        .invoke("removeAttr", "target")
        .click();

      signInAsApplyApplicant(Cypress.currentRetry);

      // TODO - make better
      // cy.visit(
      //   "https://sandbox-gap.service.cabinetoffice.gov.uk/apply/applicant/mandatory-questions/start?schemeId=-2",
      // );

      // Before you start
      cy.contains("Before you start").should("exist");
      cy.contains("Continue").click();

      // Details object
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

      // Mandatory Questions & Confirm Details
      fillMandatoryQuestions(details, false);
      confirmDetails(details);

      //Click through and edit fields
      //Return to summary after each edit
      //Click confirm and submit
      //Do this all for internal and external applications

      // Going to have two more it() for partial filled org profile and filled org profile
    },
  );
});
