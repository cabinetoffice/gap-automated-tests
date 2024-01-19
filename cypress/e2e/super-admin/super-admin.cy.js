import {
  signInAsSuperAdmin,
  signInAsApplyApplicant,
  signInToIntegrationSite,
  clickText,
  clickBack,
  assert200,
  navigateToSpecificUser,
  filterSelection,
  selectActionForItemInTable,
  validateActionForItemInTable,
  searchForUser,
} from "../../common/common";
import { TASKS } from "./constants";

import { TEST_V1_INTERNAL_GRANT } from "../../common/constants";

const { ADD_FAILED_OAUTH_AUDIT, ADD_SUCCESS_OAUTH_AUDIT } = TASKS;

const firstUserId = Cypress.env("firstUserId");

const ORIGINAL_DEPARTMENT_NAME = `Cypress - Test Department ${firstUserId}`;
const ADDED_DEPARTMENT_NAME = `Cypress - Test Add Department ${firstUserId}`;
const DEPARTMENT_NAME_DELETE = `Cypress - Test Department ${firstUserId} Delete`;
const DEPARTMENT_NAME = `Cypress - Test Department ${firstUserId} Edit`;
const EDITED_DEPARTMENT_NAME = `Cypress - Test Edited Department ${firstUserId}`;

describe("Super Admin", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Can navigate Super Admin dashboard", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();

    signInAsSuperAdmin();

    cy.contains("Manage users");

    cy.get('[data-cy="cy-button-Search"]').click();

    cy.log("Clicking Admin dashboard");
    cy.get('[data-cy="cyadminDashPageLink"] > .govuk-link').click();

    cy.log("Verifying that the user is on the admin dashboard");
    cy.contains("Manage a grant");

    cy.go("back");

    cy.log("Clicking Applicant dashboard");
    cy.get('[data-cy="cyapplicantDashPageLink"] > .govuk-link').click();

    cy.log("Verifying that the user is on the applicant dashboard");
    cy.contains("View your applications");

    cy.go("back");

    cy.log("Clicking Manage API Keys");
    cy.get('[data-cy="cytechnicalDashPageLink"] > .govuk-link').click();

    cy.log("Verifying that the user is on the Manage API Keys page");
    cy.get('[data-cy="admin-dashboard-heading"]').contains("Manage API keys");

    cy.go("back");

    cy.log("Clicking Home");
    cy.get('[data-cy="cyhomePageLink"] > .govuk-link').click();

    cy.log("Verifying that the user is on the home page");
    cy.contains("Find a grant");

    cy.go("back");

    cy.log("Navigating user pagination");
    cy.log("Clicking next page");
    cy.get(".govuk-pagination__next > .govuk-link").click();

    cy.log("clicking next page");
    cy.get(".govuk-pagination__next > .govuk-link").click();

    cy.log("clicking previous page");
    cy.get(".govuk-pagination__prev > .govuk-link").click();

    cy.log("clicking previous page");
    cy.get(".govuk-pagination__prev > .govuk-link").click();

    cy.log("Expecting previous page not to be visible");
    cy.get(".govuk-pagination__prev > .govuk-link").should("not.exist");

    cy.log("Expecting next page to be visible");
    cy.get(".govuk-pagination__next > .govuk-link").should("exist");

    cy.log("Filtering for super admins cypress");
    filterSelection("Role", "Super administrator");
    filterSelection("Department", ORIGINAL_DEPARTMENT_NAME);
    cy.log("Clicking filter");
    cy.get('[data-cy="cy-button-Apply filters"]').click();

    cy.log("Verifying filter");
    cy.get('[data-cy="cy_table_row-for-Email address-row-0-cell-0"]').contains(
      Cypress.env("oneLoginSuperAdminEmail"),
    );

    cy.log("Signing out");
    cy.get('[data-cy="cy_SignOutLink"]').click();

    cy.log("Verifying that the user is on the homepage");
    cy.contains("Find a grant");
  });

  it("Can change grant ownership", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();

    cy.log("Signing in as super admin");
    signInAsSuperAdmin();

    cy.log("Entering admin email in search box");
    cy.get("[name=searchTerm]").type(Cypress.env("oneLoginAdminEmail"));

    cy.log("Clicking search button");
    cy.get("[data-cy=cy-button-Search]").click();

    cy.log("Clicking edit on admin user");
    cy.get(
      '[data-cy="cy_table_row-for-Actions-row-0-cell-3"] > .govuk-link',
    ).click();

    cy.log("Clicking change on first grant");
    selectActionForItemInTable(
      TEST_V1_INTERNAL_GRANT.schemeName,
      "Change owner",
    );

    cy.log("Entering an email address not registered in the system");
    cy.get('[data-cy="cy-emailAddress-text-input"]').type("blah@blah.com");

    cy.log("Clicking continue");
    clickText("Confirm");
    cy.get(
      '[data-cy="cy-emailAddress-input-validation-error-details"]',
    ).contains("Email address does not belong to an admin user");

    cy.log("Entering a non-admin email address");
    cy.get('[data-cy="cy-emailAddress-text-input"]').clear();
    cy.get('[data-cy="cy-emailAddress-text-input"]').type(
      Cypress.env("oneLoginApplicantEmail"),
    );

    cy.log("Clicking continue");
    clickText("Confirm");
    cy.get(
      '[data-cy="cy-emailAddress-input-validation-error-details"]',
    ).contains("Email address does not belong to an admin user");

    cy.log("Entering an invalid email address");
    cy.get('[data-cy="cy-emailAddress-text-input"]').clear();
    cy.get('[data-cy="cy-emailAddress-text-input"]').type("blah");

    cy.log("Clicking continue");
    clickText("Confirm");
    cy.get(
      '[data-cy="cy-emailAddress-input-validation-error-details"]',
    ).contains("Please enter a valid email address");

    cy.log("Entering the admin's email address");
    cy.get('[data-cy="cy-emailAddress-text-input"]').clear();
    cy.get('[data-cy="cy-emailAddress-text-input"]').type(
      Cypress.env("oneLoginAdminEmail"),
    );

    cy.log("Clicking continue");
    clickText("Confirm");
    cy.get(
      '[data-cy="cy-emailAddress-input-validation-error-details"]',
    ).contains("This user already owns this grant");

    cy.log("Entering the super admin's email address");
    cy.get('[data-cy="cy-emailAddress-text-input"]').clear();
    cy.get('[data-cy="cy-emailAddress-text-input"]').type(
      Cypress.env("oneLoginSuperAdminEmail"),
    );

    cy.log("Clicking continue");
    clickText("Confirm");

    cy.log("Clicking confirm");
    clickText("Confirm transfer");

    cy.log("Hitting back button");
    cy.get('[data-cy="cy-back-button"]').click();

    cy.log("Entering super admin email in search box");
    cy.get("[name=searchTerm]").type(Cypress.env("oneLoginSuperAdminEmail"));

    cy.get("[data-cy=cy-button-Search]").click();

    cy.log("Clicking edit on super admin user");
    cy.get(
      '[data-cy="cy_table_row-for-Actions-row-0-cell-3"] > .govuk-link',
    ).click();

    cy.log("Verifying that the grant appears in the list");
    validateActionForItemInTable(
      TEST_V1_INTERNAL_GRANT.schemeName,
      "Change owner",
    );

    cy.log("Navigate to admin dashboard");
    cy.get('[data-cy="cy-back-button"]').click();
    cy.get('[data-cy="cyadminDashPageLink"] > .govuk-link').click();

    cy.log("Checking grant shows in admin dashboard");
    cy.get('[data-cy="cy_table_row"] > :nth-child(1)').should(
      "contain.text",
      "Cypress - Test Scheme V1",
    );
  });

  it("Can manage users", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();

    navigateToSpecificUser(Cypress.env("oneLoginApplicantEmail"));

    cy.log("Verifying that the user is an applicant");
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains("Applicant");

    cy.log("Verifying the user doesn't have a department");
    cy.get('[data-cy="cy_summaryListValue_Department"]').should("not.exist");

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    cy.log("Verifying that the user is an admin");
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains("Administrator");

    cy.log("Verifying the user has a department");
    cy.get('[data-cy="cy_summaryListValue_Department"]').contains(
      "Cypress - Test Department",
    );

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginSuperAdminEmail"));

    cy.log("Verifying that the user is an admin");
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains(
      "Super administrator",
    );

    cy.log("Verifying the user has a department");
    cy.get('[data-cy="cy_summaryListValue_Department"]').contains(
      "Cypress - Test Department",
    );

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    cy.log("Clicking change on user's department");
    selectActionForItemInTable(ORIGINAL_DEPARTMENT_NAME, "Change", {
      textCellElement: "dd",
      actionCellElement: "dd",
    });

    cy.log("Selecting a new department");
    cy.get('[data-cy="cy-radioInput-option-CabinetOffice"]').click();

    cy.log("Clicking change department");
    clickText("Change department");

    cy.log("Verifying that the user's department has changed");
    cy.get('[data-cy="cy_summaryListValue_Department"]').contains(
      "Cabinet Office",
    );

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginApplicantEmail"));

    cy.log("Clicking block user");
    cy.get(".govuk-button--secondary").contains("Block user").click();

    cy.log("Clicking block user confirmation");
    cy.get(".govuk-button").contains("Block user").click();

    cy.log("Verifying that the user is blocked");
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains("Blocked");

    cy.log("Clicking unblock user");
    cy.get(".govuk-button--secondary").contains("Unblock user").click();

    cy.log("Veryfying that the user is an applicant again");
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains("Applicant");

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginApplicantEmail"));
    cy.log("Clicking delete user");
    cy.get(".govuk-button--warning").contains("Delete user").click();

    cy.log("Clicking delete user confirmation");
    cy.get(".govuk-button").contains("Delete user").click();

    cy.log("Verifying that the user is deleted");

    searchForUser(Cypress.env("oneLoginApplicantEmail"));
    cy.contains("td", Cypress.env("oneLoginApplicantEmail")).should(
      "not.exist",
    );
  });

  it("Can reconnect to spotlight", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
    cy.task(ADD_FAILED_OAUTH_AUDIT);
    clickText("Integrations");
    reconnectSpotlight();
    cy.task(ADD_SUCCESS_OAUTH_AUDIT);
    clickText("Integrations");
    cy.get("[data-cy='cy_table_row-for-Integration-row-0-cell-0']").contains(
      "Spotlight",
    );
    cy.get('[data-cy="cy_table_row-for-Status-row-0-cell-1"]');
    cy.get("[data-cy='cy_table_row-for-Status-row-0-cell-1']").contains(
      "Connected",
    );
  });

  it("Can manage roles", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    cy.log("Clicking remove on admin role");
    cy.get(
      ":nth-child(3) > .govuk-summary-list__actions > .govuk-link",
    ).click();

    cy.log("Unchecking admin role");
    cy.get('[data-cy="cy-checkbox-value-3"]').click();

    cy.log("Clicking change roles");
    cy.get(".govuk-button").contains("Change Roles").click();

    cy.log("Verifying that the user is now an applicant");
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains("Applicant");

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginApplicantEmail"));

    cy.log("Adding super admin role");
    cy.get(".govuk-summary-list__actions > .govuk-link").click();
    cy.get('[data-cy="cy-checkbox-value-4"]').click();
    cy.get(".govuk-button").contains("Change Roles").click();

    cy.log("Giving a department");
    cy.get('[data-cy="cy-radioInput-label-CypressTestDepartment"]')
      .first()
      .click();
    cy.get(".govuk-button").contains("Change department").click();

    cy.log("Signing out");
    cy.get('[data-cy="cy_SignOutLink"]').click();

    cy.log("Signing in as applicant");
    cy.get('[data-cy="cySignInAndApply-Link"]').click();
    signInAsApplyApplicant();

    cy.log("Expecting to land on super admin dashbard");
    cy.contains("Manage users");
  });

  it("Can manage departments", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    cy.log("Clicking change on user's department");
    selectActionForItemInTable(ORIGINAL_DEPARTMENT_NAME, "Change", {
      textCellElement: "dd",
      actionCellElement: "dd",
    });
    cy.get(".govuk-link").contains("Manage departments").click();

    cy.log("Adding department");
    cy.get(".govuk-button").contains("Add new department").click();

    cy.log("Trying to submit empty form data");
    cy.get(".govuk-button").contains("Add department").click();
    cy.get('[data-cy="cyErrorBannerHeading"]').contains("There is a problem");
    cy.get('[data-cy="cyError_ggisID"]').contains("Enter a GGIS ID");
    cy.get('[data-cy="cyError_name"]').contains("Enter a Department name");

    cy.log("Entering a name but no ID");
    cy.get('[data-cy="cy-name-text-input"]').type(ADDED_DEPARTMENT_NAME);
    cy.get(".govuk-button").contains("Add department").click();
    cy.get('[data-cy="cyErrorBannerHeading"]').contains("There is a problem");
    cy.get('[data-cy="cyError_ggisID"]').contains("Enter a GGIS ID");

    cy.log("Entering an ID but no name");
    cy.get('[data-cy="cy-name-text-input"]').clear();
    cy.get('[data-cy="cy-ggisID-text-input"]').type("123456");
    cy.get(".govuk-button").contains("Add department").click();
    cy.get('[data-cy="cyErrorBannerHeading"]').contains("There is a problem");
    cy.get('[data-cy="cyError_name"]').contains("Enter a Department name");

    cy.log("Entering a valid ID and name");
    cy.get('[data-cy="cy-name-text-input"]').type(ADDED_DEPARTMENT_NAME);
    cy.get(".govuk-button").contains("Add department").click();

    cy.log("Verifying that the department has been added");
    cy.get(".govuk-summary-list__key").contains(ADDED_DEPARTMENT_NAME);

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    cy.log("Clicking change on user's department");
    selectActionForItemInTable(ORIGINAL_DEPARTMENT_NAME, "Change", {
      textCellElement: "dd",
      actionCellElement: "dd",
    });
    cy.get(".govuk-link").contains("Manage departments").click();

    cy.log("Clicking edit on department");

    selectActionForItemInTable(DEPARTMENT_NAME, "Edit");

    cy.log("Trying to submit empty form data");
    cy.get('[data-cy="cy-name-text-input"]').clear();
    cy.get('[data-cy="cy-ggisID-text-input"]').clear();
    cy.get(".govuk-button").contains("Save changes").click();
    cy.get('[data-cy="cyErrorBannerHeading"]').contains("There is a problem");
    cy.get('[data-cy="cyError_ggisID"]').contains("Enter a GGIS ID");
    cy.get('[data-cy="cyError_name"]').contains("Enter a Department name");

    cy.log("Entering a name but no ID");
    cy.get('[data-cy="cy-name-text-input"]').clear();
    cy.get('[data-cy="cy-ggisID-text-input"]').clear();
    cy.get('[data-cy="cy-name-text-input"]').type(EDITED_DEPARTMENT_NAME);
    cy.get(".govuk-button").contains("Save changes").click();
    cy.get('[data-cy="cyErrorBannerHeading"]').contains("There is a problem");
    cy.get('[data-cy="cyError_ggisID"]').contains("Enter a GGIS ID");

    cy.log("Entering an ID but no name");
    cy.get('[data-cy="cy-name-text-input"]').clear();
    cy.get('[data-cy="cy-ggisID-text-input"]').clear();
    cy.get('[data-cy="cy-ggisID-text-input"]').type("123456");
    cy.get(".govuk-button").contains("Save changes").click();
    cy.get('[data-cy="cyErrorBannerHeading"]').contains("There is a problem");
    cy.get('[data-cy="cyError_name"]').contains("Enter a Department name");

    cy.log("Entering a valid ID and name");
    cy.get('[data-cy="cy-name-text-input"]').clear();
    cy.get('[data-cy="cy-ggisID-text-input"]').clear();
    cy.get('[data-cy="cy-name-text-input"]').type(EDITED_DEPARTMENT_NAME);
    cy.get('[data-cy="cy-ggisID-text-input"]').type("123456");
    cy.get(".govuk-button").contains("Save changes").click();

    cy.log("Verifying that the department has been edited");
    cy.get(".govuk-summary-list__key").contains(EDITED_DEPARTMENT_NAME);

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    cy.log("Clicking change on user's department");
    selectActionForItemInTable(ORIGINAL_DEPARTMENT_NAME, "Change", {
      textCellElement: "dd",
      actionCellElement: "dd",
    });
    cy.get(".govuk-link").contains("Manage departments").click();

    cy.log("Clicking delete on department");

    selectActionForItemInTable(DEPARTMENT_NAME_DELETE, "Edit");

    cy.log("Clicking delete department");
    cy.get(".govuk-button").contains("Delete department").click();

    cy.log("Confirming delete department");
    cy.get(".govuk-button").contains("Delete department").click();

    cy.log("Verifying that the department has been deleted");
    cy.get(".govuk-summary-list__key")
      .contains(DEPARTMENT_NAME_DELETE)
      .should("not.exist");
  });
});

const reconnectSpotlight = () => {
  assert200(cy.contains("Reconnect"));
};
