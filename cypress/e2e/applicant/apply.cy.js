import {
  clickSaveAndContinue,
  yesSectionComplete,
  signInToIntegrationSite,
  clickSave,
  searchForGrant,
  signInAsApplyApplicant,
  signOut,
  clickBack,
  POST_LOGIN_BASE_URL,
} from "../../common/common";
import {
  fillOutDocUpload,
  fillOutCustomSection,
  fillOutEligibity,
  fillOutRequiredChecks,
  submitApplication,
  equalitySectionAccept,
} from "./helper";
// import { TEST_V1_GRANT } from "../../common/constants";

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
});
