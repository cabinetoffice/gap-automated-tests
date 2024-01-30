import {
  clickSaveAndContinue,
  yesSectionComplete,
  clickContinue,
  clickSave,
  clickBack,
  validateValueForKeyInTable,
} from "../../common/common";

export const equalitySectionAccept = () => {
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

export const validateMqNonLimitedJourney = () => {
  clickBack();
  cy.contains("Enter your Charity Commission number (if you have one)");
  clickBack();
  cy.contains("Enter your Companies House number (if you have one)");
  clickBack();
  cy.contains("Enter your organisation's address");
  clickBack();
  cy.contains("Enter the name of your organisation");
  clickBack();
  cy.contains("Choose your application type");
  cy.get(`[data-cy=cy-radioInput-option-NonLimitedCompany]`)
    .should("not.be.checked")
    .click();
  cy.get(`[data-cy=cy-radioInput-option-LimitedCompany]`).should(
    "not.be.checked",
  );
  clickSaveAndContinue();

  // Name
  cy.contains("Enter your full name").should("not.exist");
  cy.contains("Enter the name of your organisation").should("exist");
  clickSaveAndContinue();

  // Address
  cy.contains("Enter your address").should("not.exist");
  cy.contains("Enter your organisation's address").should("exist");
  clickSaveAndContinue();

  // How much funding
  cy.contains("How much funding are you applying for?").should("exist");
};

export const validateMqIndividualJourney = () => {
  clickBack();
  cy.contains("Enter your organisation's address");
  clickBack();
  cy.contains("Enter the name of your organisation");
  clickBack();
  cy.contains("Choose your application type");
  cy.get(`[data-cy=cy-radioInput-option-IAmApplyingAsAnIndividual]`)
    .should("not.be.checked")
    .click();
  cy.get(`[data-cy=cy-radioInput-option-NonLimitedCompany]`).should(
    "not.be.checked",
  );
  clickSaveAndContinue();

  // Name
  cy.contains("Enter the name of your organisation").should("not.exist");
  cy.contains("Enter your full name").should("exist");
  clickSaveAndContinue();

  // Address
  cy.contains("Enter your organisation's address").should("not.exist");
  cy.contains("Enter your address").should("exist");
  clickSaveAndContinue();

  // How much funding
  cy.contains("How much funding are you applying for?").should("exist");
};

export const validateMqOrgFieldsWithoutCompaniesHouseOrCharityCommission =
  () => {
    cy.contains("Name").should("exist");
    cy.contains("Address").should("exist");
    cy.contains("Companies House number").should("not.exist");
    cy.contains("Charity Commission number").should("not.exist");
  };

export const validateMqOrgFieldsWithCompaniesHouseAndCharityCommission = () => {
  cy.contains("Name").should("exist");
  cy.contains("Address").should("exist");
  cy.contains("Companies House number").should("exist");
  cy.contains("Charity Commission number").should("exist");
};

export const validateMqIndividualSummaryScreen = () => {
  validateMqOrgFieldsWithoutCompaniesHouseOrCharityCommission();
  cy.contains("How much funding are you applying for?").should("exist");
  cy.contains("Where will this funding be spent?").should("exist");
};

export const editOrgTypeToNonLimitedCompany = () => {
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationType"]',
  ).click();

  cy.get(`[data-cy=cy-radioInput-option-NonLimitedCompany]`)
    .should("not.be.checked")
    .click();
  cy.get(`[data-cy=cy-radioInput-option-IAmApplyingAsAnIndividual]`).should(
    "not.be.checked",
  );
  clickSaveAndContinue();
};

export const validateMqNonLimitedSummaryScreen = () => {
  validateMqOrgFieldsWithoutCompaniesHouseOrCharityCommission();
  cy.contains("How much funding are you applying for?").should("exist");
  cy.contains("Where will this funding be spent?").should("exist");
};

export const editOrgTypeToLimitedCompany = () => {
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationType"]',
  ).click();

  cy.get(`[data-cy=cy-radioInput-option-LimitedCompany]`)
    .should("not.be.checked")
    .click();
  cy.get(`[data-cy=cy-radioInput-option-NonLimitedCompany]`).should(
    "not.be.checked",
  );
  clickSaveAndContinue();
};

export const validateMqLimitedCompanySummaryScreen = () => {
  validateMqOrgFieldsWithCompaniesHouseAndCharityCommission();
  cy.contains("How much funding are you applying for?").should("exist");
  cy.contains("Where will this funding be spent?").should("exist");
};

export const fillOrgProfile = (details) => {
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

export const partialFillOrgProfile = (details) => {
  // Open Org Profile Page
  cy.get('[data-cy="cy-link-card-Your saved information"]').click();

  cy.get('[data-cy="cy-organisation-details-Type of organisation"]').should(
    "exist",
  );
  cy.get('[data-cy="cy-organisation-details-Type of application"]').should(
    "not.exist",
  );
  validateMqOrgFieldsWithCompaniesHouseAndCharityCommission();

  // Non-limited company
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationType"]',
  ).click();
  cy.get('[data-cy="cy-radioInput-option-NonLimitedCompany"]').click();
  clickSave();
  cy.get('[data-cy="cy-organisation-details-Type of organisation"]').should(
    "exist",
  );
  cy.get('[data-cy="cy-organisation-details-Type of application"]').should(
    "not.exist",
  );
  validateMqOrgFieldsWithoutCompaniesHouseOrCharityCommission();

  // Individual
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationType"]',
  ).click();
  cy.get('[data-cy="cy-radioInput-option-IAmApplyingAsAnIndividual"]').click();
  clickSave();
  cy.get('[data-cy="cy-organisation-details-Type of application"]').should(
    "exist",
  );
  cy.get('[data-cy="cy-organisation-details-Type of organisation"]').should(
    "not.exist",
  );
  validateMqOrgFieldsWithoutCompaniesHouseOrCharityCommission();

  // Org Type - Filled
  cy.get(
    '[data-cy="cy-organisation-details-navigation-organisationType"]',
  ).click();
  cy.get('[data-cy="cy-radioInput-option-LimitedCompany"]').click();
  clickSave();

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

export const editDetailsOnSummaryScreen = (details) => {
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

export const editOrgDetails = (details) => {
  // Open Org Details page
  cy.get('[data-cy="cy-section-title-link-Your organisation"]').click();

  // Check, Change & Check the details

  // Org Type
  cy.get(`[data-cy="cy-section-value-${details.orgType}"]`).should("exist");

  cy.get('[data-cy="cy-section-details-navigation-APPLICANT_TYPE"]').click();
  cy.get('[data-cy="cy-radioInput-option-Charity"]').click();
  clickSaveAndContinue();

  cy.get(`[data-cy="cy-section-value-Charity"]`).should("exist");

  // Name
  cy.get(`[data-cy="cy-section-value-${details.name}"]`).should("exist");

  cy.get(
    '[data-cy="cy-section-details-navigation-APPLICANT_ORG_NAME"]',
  ).click();
  cy.get("[data-cy=cy-name-text-input]")
    .should("have.value", details.name)
    .type("1");
  clickSaveAndContinue();

  cy.get(`[data-cy="cy-section-value-${details.name + "1"}"]`).should("exist");

  // Address
  cy.get('[data-cy="cy-organisation-value-APPLICANT_ORG_ADDRESS"]')
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        details.address[index] +
          (index < details.address.length - 1 ? "," : ""),
      );
    });
  cy.get(
    '[data-cy="cy-section-details-navigation-APPLICANT_ORG_ADDRESS"]',
  ).click();
  ["addressLine1", "addressLine2", "city", "county", "postcode"].forEach(
    (item, index) => {
      cy.get(`[data-cy=cy-${item}-text-input]`)
        .should("have.value", details.address[index])
        .clear()
        .type(details.address[index] + "1");
    },
  );
  clickSaveAndContinue();
  cy.get('[data-cy="cy-organisation-value-APPLICANT_ORG_ADDRESS"]')
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        details.address[index] +
          "1" +
          (index < details.address.length - 1 ? "," : ""),
      );
    });

  // Charities Commission
  cy.get(`[data-cy="cy-section-value-${details.charitiesCommission}"]`).should(
    "exist",
  );

  cy.get(
    '[data-cy="cy-section-details-navigation-APPLICANT_ORG_CHARITY_NUMBER"]',
  ).click();
  cy.get("[data-cy=cy-charityCommissionNumber-text-input]")
    .should("have.value", details.charitiesCommission)
    .clear()
    .type(details.charitiesCommission + "1");
  clickSaveAndContinue();

  cy.get(
    `[data-cy="cy-section-value-${details.charitiesCommission + "1"}"]`,
  ).should("exist");

  // Companies House
  cy.get(`[data-cy="cy-section-value-${details.companiesHouse}"]`).should(
    "exist",
  );

  cy.get(
    '[data-cy="cy-section-details-navigation-APPLICANT_ORG_COMPANIES_HOUSE"]',
  ).click();
  cy.get("[data-cy=cy-companiesHouseNumber-text-input]")
    .should("have.value", details.companiesHouse)
    .clear()
    .type(details.companiesHouse + "1");
  clickSaveAndContinue();

  cy.get(`[data-cy="cy-section-value-${details.companiesHouse + "1"}"]`).should(
    "exist",
  );

  // Complete section & move to funding
  cy.get('[data-cy="cy-radioInput-option-YesIveCompletedThisSection"]').click();
  clickSaveAndContinue();
};

export const editFundingDetails = (details) => {
  cy.get('[data-cy="cy-section-title-link-Funding"]').click();

  // Check, Change & Check the details

  // Funding amount
  cy.get(`[data-cy="cy-section-value-${details.howMuchFunding}"]`).should(
    "exist",
  );

  cy.get('[data-cy="cy-section-details-navigation-APPLICANT_AMOUNT"]').click();
  cy.contains("How much funding are you applying for?");
  cy.get("[data-cy=cy-fundingAmount-text-input-numeric]")
    .should("have.value", details.howMuchFunding)
    .clear()
    .type(details.howMuchFunding + "1");
  clickSaveAndContinue();

  cy.get(`[data-cy="cy-section-value-${details.howMuchFunding + "1"}"]`).should(
    "exist",
  );

  // Funding locations
  cy.get('[data-cy="cy-organisation-value-BENEFITIARY_LOCATION"]')
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        details.fundingLocation[index] +
          (index < details.fundingLocation.length - 1 ? "," : ""),
      );
    });

  cy.get(
    '[data-cy="cy-section-details-navigation-BENEFITIARY_LOCATION"]',
  ).click();
  cy.contains("Where will this funding be spent?").should("exist");
  details.fundingLocation.forEach((item) => {
    // cy.get('[data-cy="cy-checkbox-value-North East England"]')
    cy.get(`[data-cy="cy-checkbox-value-${item}"]`).click();
  });
  cy.get(`[data-cy="cy-checkbox-value-${details.fundingLocation[0]}"]`).click();
  clickSaveAndContinue();

  cy.get('[data-cy="cy-organisation-value-BENEFITIARY_LOCATION"]').contains(
    details.fundingLocation[0],
  );

  // Complete the section
  cy.get('[data-cy="cy-radioInput-option-YesIveCompletedThisSection"]').click();
  clickSaveAndContinue();
};

export const confirmDetailsOnSummaryScreen = (details) => {
  // Confirm your details

  // Name
  cy.get('[data-cy="cy-organisation-value-Name"]').contains(details.name);

  // Address
  cy.get("[data-cy=cy-organisation-value-Address]")
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        details.address[index] +
          (index < details.address.length - 1 ? "," : ""),
      );
    });

  // Org Type
  cy.get('[data-cy="cy-organisation-value-Type of organisation"]').contains(
    details.orgType,
  );

  // Companies House
  cy.get('[data-cy="cy-organisation-value-Companies House number"]').contains(
    details.companiesHouse,
  );

  // Charities Commission
  cy.get(
    '[data-cy="cy-organisation-value-Charity Commission number"]',
  ).contains(details.charitiesCommission);

  // How much funding
  cy.get(
    '[data-cy="cy-organisation-value-How much funding are you applying for?"]',
  ).contains(`£ ${details.howMuchFunding}`);

  // Funding locations
  cy.get(
    '[data-cy="cy-organisation-value-Where will this funding be spent?"] > .govuk-list',
  )
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        details.fundingLocation[index] +
          (index < details.fundingLocation.length - 1 ? "," : ""),
      );
    });
};

export const validateOrgDetailsForNonLimitedCompany = () => {
  cy.get('[data-cy="cy-section-title-link-Your organisation"]').click();
  cy.get('[data-cy="cy-section-details-navigation-APPLICANT_TYPE"]').click();
  cy.get('[data-cy="cy-radioInput-option-NonLimitedCompany"]').click();
  clickSaveAndContinue();

  cy.contains("Type of organisation").should("exist");
  cy.contains("Type of application").should("not.exist");
  cy.contains("Name").should("exist");
  cy.contains("Address").should("exist");
  cy.contains("Companies House number").should("not.exist");
  cy.contains("Charity Commission number").should("not.exist");
  yesSectionComplete();
  cy.contains("Your organisation").should("exist");
  cy.contains("Your details").should("not.exist");
};

export const validateOrgDetailsForIndividual = () => {
  cy.get('[data-cy="cy-section-title-link-Your organisation"]').click();
  cy.get('[data-cy="cy-section-details-navigation-APPLICANT_TYPE"]').click();
  cy.get('[data-cy="cy-radioInput-option-IAmApplyingAsAnIndividual"]').click();
  clickSaveAndContinue();

  cy.contains("Type of application").should("exist");
  cy.contains("Type of organisation").should("not.exist");
  cy.contains("Name").should("exist");
  cy.contains("Address").should("exist");
  cy.contains("Companies House number").should("not.exist");
  cy.contains("Charity Commission number").should("not.exist");
  yesSectionComplete();
  cy.contains("Your organisation").should("not.exist");
  cy.contains("Your details").should("exist");
};

export const validateOrgDetailsForCharity = () => {
  cy.get('[data-cy="cy-section-title-link-Your details"]').click();
  cy.get('[data-cy="cy-section-details-navigation-APPLICANT_TYPE"]').click();
  cy.get('[data-cy="cy-radioInput-option-Charity"]').click();
  clickSaveAndContinue();

  cy.contains("Type of organisation").should("exist");
  cy.contains("Type of application").should("not.exist");
  cy.contains("Name").should("exist");
  cy.contains("Address").should("exist");
  cy.contains("Companies House number").should("exist");
  cy.contains("Charity Commission number").should("exist");
  yesSectionComplete();
  cy.contains("Your organisation").should("exist");
  cy.contains("Your details").should("not.exist");
};

export const confirmOrgAndFundingDetails = (
  suffix,
  orgType,
  fundingLocations,
  details,
) => {
  // Check Org Details Match
  cy.get('[data-cy="cy-section-title-link-Your organisation"]').click();
  cy.get('[data-cy="cy-manage-section-header"]').contains("Your organisation");

  cy.get(`[data-cy="cy-section-value-${details.name + suffix}"]`).should(
    "exist",
  );
  cy.get(`[data-cy="cy-section-value-${orgType}"]`).should("exist");
  cy.get('[data-cy="cy-organisation-value-APPLICANT_ORG_ADDRESS"]')
    .find("ul")
    .children("li")
    .each((listItem, index) => {
      cy.wrap(listItem).contains(
        details.address[index] +
          suffix +
          (index < details.address.length - 1 ? "," : ""),
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
  cy.get('[data-cy="cy-status-tag-Your organisation-Completed"]').should(
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

export const validateSubmissionSummarySection = (sectionTitle, questions) => {
  cy.contains("div", sectionTitle)
    .parent()
    .within(() => {
      questions.forEach(({ key, value }) => {
        validateValueForKeyInTable(key, value);
      });
    });
};

export const triggerChangeFromSummary = (sectionTitle, questionTitle) => {
  cy.contains("div", sectionTitle)
    .parent()
    .within(() => {
      cy.contains(questionTitle)
        .parent()
        .within(() => {
          cy.contains("Change").click();
        });
    });
};
