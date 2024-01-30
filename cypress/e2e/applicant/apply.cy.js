import {
  clickSaveAndContinue,
  yesSectionComplete,
  signInToIntegrationSite,
  clickSave,
  searchForGrant,
  signInAsApplyApplicant,
  signOut,
  clickBack,
  log,
  ADMIN_DASHBOARD_URL,
  SUPER_ADMIN_DASHBOARD_URL,
} from "../../common/common";
import {
  fillOutDocUpload,
  fillOutCustomSection,
  fillOutEligibity,
  fillOutRequiredChecks,
  submitApplication,
  equalitySectionAccept,
} from "./helper";

describe("Apply for a Grant", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Can start, save, come back, continue and submit new grant application for V1 Internal Grant", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

    log("Apply V1 Internal Grant - Searching for grant");
    searchForGrant(Cypress.env("testV1InternalGrant").advertName);

    cy.contains(Cypress.env("testV1InternalGrant").advertName).click();

    cy.contains("Start new application").invoke("removeAttr", "target").click();

    log("Apply V1 Internal Grant - Signing in as applicant");
    signInAsApplyApplicant();

    // checks 'mailto' support email link
    cy.get('[data-cy="cy-support-email"]').should(
      "have.attr",
      "href",
      `mailto:${Cypress.env("oneLoginAdminEmail")}`,
    );

    log("Apply V1 Internal Grant - Filling out Eligibility");
    fillOutEligibity();

    // test sign out and back in
    log("Apply V1 Internal Grant - Signing out");
    cy.contains("Save and come back later").click();

    signOut();

    log("Apply V1 Internal Grant - Signing back in as applicant");
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsApplyApplicant();

    log("Apply V1 Internal Grant - Returning to in progress application");
    cy.get('[data-cy="cy-your-applications-link"]').click();
    cy.contains("Edit").click();

    cy.get('[data-cy="cy-status-tag-Eligibility-Completed"]');

    log("Apply V1 Internal Grant - Filling out Required Checks");
    fillOutRequiredChecks();

    log("Apply V1 Internal Grant - Filling out Custom Section");
    fillOutCustomSection();

    cy.get('[data-cy="cy-status-tag-Eligibility-Completed"]');
    cy.get('[data-cy="cy-status-tag-Required checks-Completed"]');
    cy.get('[data-cy="cy-status-tag-Custom Section-Completed"]');

    // test doc upload is required
    log("Apply V1 Internal Grant - Removing uploaded doc from submission");
    cy.contains("Review and submit").should("not.be.disabled");

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
    cy.contains("Review and submit").should("be.disabled");

    // re-add doc upload
    log("Apply V1 Internal Grant - Re-adding uploaded doc to submission");
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

    cy.contains("Review and submit").should("not.be.disabled");

    // submit
    log("Apply V1 Internal Grant - Submitting application");
    submitApplication();

    log("Apply V1 Internal Grant - Filling out equality section");
    equalitySectionAccept();

    log("Apply V1 Internal Grant - Viewing submission");
    cy.contains("View your applications").click();

    cy.contains("Your applications");
    cy.contains("All of your current and past applications are listed below.");
    cy.contains(Cypress.env("testV1InternalGrant").applicationName).should(
      "exist",
    );
    cy.get(
      '[data-cy="cy-status-tag-Cypress - Test Application V1 Internal-Submitted"]',
    ).should("exist");
    cy.contains("View").should("exist");

    // checks that clicking on submitted application does nothing
    cy.get(
      `[data-cy="cy-application-link-${
        Cypress.env("testV1InternalGrant").applicationName
      }"]`,
    ).should("not.have.attr", "href");
  });

  it("Can complete V1 External grant journey", () => {
    cy.task("publishGrantsToContentful");
    // wait for grant to be published to contentful
    cy.wait(5000);

    // Sign in
    log("Apply V1 External Grant - Signing in as applicant");
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant();

    // Search & Start external application
    log("Apply V1 External Grant - Searching for grant");
    cy.get('[data-cy="cy-find-a-grant-link"]').click();
    searchForGrant(Cypress.env("testV1ExternalGrant").advertName);
    cy.contains(Cypress.env("testV1ExternalGrant").advertName).click();

    // Check button link
    log("Apply V1 External Grant - Checking link for external application");
    cy.get(".govuk-grid-column-full > .govuk-button")
      .invoke("attr", "href")
      .should(
        "eq",
        `/apply/${Cypress.env("testV1ExternalGrant").contentfulSlug}`,
      );
    cy.contains("Start new application").invoke("removeAttr", "target").click();
  });

  it("can land on application dashboard and view details", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();

    log("Apply Dashboard & Profile - Signing in as applicant");
    signInAsApplyApplicant();

    log("Apply Dashboard & Profile - Viewing profile");
    cy.contains("Your saved information").click();

    log("Apply Dashboard & Profile - Editing name");
    cy.get(
      "[data-cy=cy-organisation-details-navigation-organisationName]",
    ).click();
    cy.get("[data-cy=cy-legalName-text-input]").type("Organisation Name");
    clickSave();
    cy.get("[data-cy=cy-organisation-value-Name]").should(
      "have.text",
      "Organisation Name",
    );

    log("Apply Dashboard & Profile - Editing address");
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

    log("Apply Dashboard & Profile - Editing org type");
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

    log("Apply Dashboard & Profile - Editing Companies House number");
    cy.get(
      "[data-cy=cy-organisation-details-navigation-organisationCompaniesHouseNumber]",
    ).click();
    cy.get("[data-cy=cy-companiesHouseNumber-text-input]").type("01234");
    clickSave();
    cy.contains("01234").should("exist");

    log("Apply Dashboard & Profile - Editing Charity Commission number");
    cy.get(
      "[data-cy=cy-organisation-details-navigation-organisationCharity]",
    ).click();
    cy.get("[data-cy=cy-charityCommissionNumber-text-input]").type("56789");
    clickSave();
    cy.contains("56789").should("exist");

    log("Apply Dashboard & Profile - Returning to dashboard");
    cy.contains("Back to my account").click();

    cy.get("[data-cy=cy-find-a-grant-link").click();
    cy.get("[data-cy=cyHomePageTitle]").should("have.text", "Find a grant");
    cy.go("back");

    log(
      "Apply Dashboard & Profile - Checking admin and super-admin dashboard returns 404",
    );
    [ADMIN_DASHBOARD_URL, SUPER_ADMIN_DASHBOARD_URL].forEach((page) => {
      cy.visit(page, { failOnStatusCode: false })
        .contains("Page not found")
        .should("exist");
      cy.go("back");
    });

    log("Apply Dashboard & Profile - Editing One Login details");
    cy.contains("Your sign in details").click();

    // TODO reenable click when MFA strategy is defined
    cy.contains("Change your sign in details in your GOV.UK One Login");
    // .click();

    // cy.origin(Cypress.env('oneLoginBaseUrl'), () => {
    //   cy.contains("Enter the 6 digit security code");
    // });
  });
});
