import {
  clickBack,
  log,
  navigateToSpecificUser,
  signInAsApplyApplicant,
  signInAsSuperAdmin,
  signInToIntegrationSite,
} from "../../common/common";

describe("Super Admin", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Can manage roles", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    log("Super Admin Manage Roles - Signing in as super admin");
    signInAsSuperAdmin();
    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    log("Super Admin Manage Roles - Clicking remove on admin role");
    cy.get(
      ":nth-child(3) > .govuk-summary-list__actions > .govuk-link",
    ).click();

    log("Super Admin Manage Roles - Unchecking admin role");
    cy.get('[data-cy="cy-checkbox-value-3"]').click();

    log("Super Admin Manage Roles - Clicking change roles");
    cy.get(".govuk-button").contains("Change Roles").click();

    log(
      "Super Admin Manage Roles - Verifying that the user is now an applicant",
    );
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains("Applicant");

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginApplicantEmail"));

    log("Super Admin Manage Roles - Adding super admin role");
    cy.get(".govuk-summary-list__actions > .govuk-link").click();
    cy.get('[data-cy="cy-checkbox-value-4"]').click();
    cy.get(".govuk-button").contains("Change Roles").click();

    log("Super Admin Manage Roles - Giving a department");
    cy.get('[data-cy="cy-radioInput-label-CypressTestDepartment"]')
      .first()
      .click();
    cy.get(".govuk-button").contains("Change department").click();

    log("Super Admin Manage Roles - Signing out");
    cy.get('[data-cy="cy_SignOutLink"]').click();

    log("Super Admin Manage Roles - Signing in as applicant");
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant();
    cy.visit("/apply/admin/super-admin-dashboard");

    log("Super Admin Manage Roles - Expecting to land on super admin dashbard");
    cy.contains("Manage users");
  });
});
