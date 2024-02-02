import {
  clickBack,
  clickText,
  log,
  navigateToSpecificUser,
  searchForUser,
  selectActionForItemInTable,
  signInAsSuperAdmin,
  signInToIntegrationSite,
} from "../../common/common";

const firstUserId = Cypress.env("firstUserId");

const ORIGINAL_DEPARTMENT_NAME = `Cypress - Test Department ${firstUserId}`;

describe("Super Admin", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Can manage users", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    log("Super Admin Manage Users - Signing in as super admin");
    signInAsSuperAdmin();

    navigateToSpecificUser(Cypress.env("oneLoginApplicantEmail"));

    log("Super Admin Manage Users - Verifying that the user is an applicant");
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains("Applicant");

    log(
      "Super Admin Manage Users - Verifying the user doesn't have a department",
    );
    cy.get('[data-cy="cy_summaryListValue_Department"]').should("not.exist");

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    log("Super Admin Manage Users - Verifying that the user is an admin");
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains("Administrator");

    log("Super Admin Manage Users - Verifying the user has a department");
    cy.get('[data-cy="cy_summaryListValue_Department"]').contains(
      "Cypress - Test Department",
    );

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginSuperAdminEmail"));

    log("Super Admin Manage Users - Verifying that the user is an admin");
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains(
      "Super administrator",
    );

    log("Super Admin Manage Users - Verifying the user has a department");
    cy.get('[data-cy="cy_summaryListValue_Department"]').contains(
      "Cypress - Test Department",
    );

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    log("Super Admin Manage Users - Clicking change on user's department");
    selectActionForItemInTable(ORIGINAL_DEPARTMENT_NAME, "Change", {
      textCellElement: "dd",
      actionCellElement: "dd",
    });

    log("Super Admin Manage Users - Selecting a new department");
    cy.get('[data-cy="cy-radioInput-option-CabinetOffice"]').click();

    log("Super Admin Manage Users - Clicking change department");
    clickText("Change department");

    log(
      "Super Admin Manage Users - Verifying that the user's department has changed",
    );
    cy.get('[data-cy="cy_summaryListValue_Department"]').contains(
      "Cabinet Office",
    );

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginApplicantEmail"));

    log("Super Admin Manage Users - Clicking block user");
    cy.get(".govuk-button--secondary").contains("Block user").click();

    log("Super Admin Manage Users - Clicking block user confirmation");
    cy.get(".govuk-button").contains("Block user").click();

    log("Super Admin Manage Users - Verifying that the user is blocked");
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains("Blocked");

    log("Super Admin Manage Users - Clicking unblock user");
    cy.get(".govuk-button--secondary").contains("Unblock user").click();

    log(
      "Super Admin Manage Users - Verifying that the user is an applicant again",
    );
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains("Applicant");

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginApplicantEmail"));
    log("Super Admin Manage Users - Clicking delete user");
    cy.get(".govuk-button--warning").contains("Delete user").click();

    log("Super Admin Manage Users - Clicking delete user confirmation");
    cy.get(".govuk-button").contains("Delete user").click();

    log("Super Admin Manage Users - Verifying that the user is deleted");

    searchForUser(Cypress.env("oneLoginApplicantEmail"));
    cy.contains("td", Cypress.env("oneLoginApplicantEmail")).should(
      "not.exist",
    );
  });
});
