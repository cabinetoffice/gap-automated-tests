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
  log,
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

const SUPER_ADMIN_DASHBOARD = `${Cypress.env(
  "applicationBaseUrl",
)}/apply/admin/super-admin-dashboard`;

describe("Super Admin", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Can navigate Super Admin dashboard", () => {
    log("Super Admin Navigation - Signing in as Super Admin");
    cy.get("[data-cy=cySignInAndApply-Link]").click();

    signInAsSuperAdmin();

    cy.contains("Manage users");

    cy.get('[data-cy="cy-button-Search"]').click();

    log("Super Admin Navigation - Clicking Admin dashboard");
    cy.get('[data-cy="cyadminDashPageLink"] > .govuk-link').click();

    log(
      "Super Admin Navigation - Verifying that the user is on the admin dashboard",
    );
    cy.contains("Manage a grant");

    cy.visit(SUPER_ADMIN_DASHBOARD);

    log("Super Admin Navigation - Clicking Applicant dashboard");
    cy.get('[data-cy="cyapplicantDashPageLink"] > .govuk-link').click();

    log(
      "Super Admin Navigation - Verifying that the user is on the applicant dashboard",
    );
    cy.contains("View your applications");

    cy.visit(SUPER_ADMIN_DASHBOARD);

    log("Super Admin Navigation - Clicking Manage API Keys");
    cy.get('[data-cy="cytechnicalDashPageLink"] > .govuk-link').click();

    log(
      "Super Admin Navigation - Verifying that the user is on the Manage API Keys page",
    );
    cy.get('[data-cy="admin-dashboard-heading"]').contains("Manage API keys");

    cy.visit(SUPER_ADMIN_DASHBOARD);

    log("Super Admin Navigation - Clicking Home");
    cy.get('[data-cy="cyhomePageLink"] > .govuk-link').click();

    log("Super Admin Navigation - Verifying that the user is on the home page");
    cy.contains("Find a grant");

    cy.visit(SUPER_ADMIN_DASHBOARD);

    log("Super Admin Navigation - Navigating user pagination");
    log("Super Admin Navigation - Clicking next page");
    cy.get(".govuk-pagination__next > .govuk-link").click();

    log("Super Admin Navigation - clicking next page");
    cy.get(".govuk-pagination__next > .govuk-link").click();

    log("Super Admin Navigation - clicking previous page");
    cy.get(".govuk-pagination__prev > .govuk-link").click();

    log("Super Admin Navigation - clicking previous page");
    cy.get(".govuk-pagination__prev > .govuk-link").click();

    log("Super Admin Navigation - Expecting previous page not to be visible");
    cy.get(".govuk-pagination__prev > .govuk-link").should("not.exist");

    log("Super Admin Navigation - Expecting next page to be visible");
    cy.get(".govuk-pagination__next > .govuk-link").should("exist");

    log("Super Admin Navigation - Filtering for super admins cypress");
    filterSelection("Role", "Super administrator");
    filterSelection("Department", ORIGINAL_DEPARTMENT_NAME);

    log("Super Admin Navigation - Clicking filter");
    cy.get('[data-cy="cy-button-Apply filters"]').click();

    log("Super Admin Navigation - Verifying filter");
    cy.get('[data-cy="cy_table_row-for-Email address-row-0-cell-0"]').contains(
      Cypress.env("oneLoginSuperAdminEmail"),
    );

    log("Super Admin Navigation - Signing out");
    cy.get('[data-cy="cy_SignOutLink"]').click();

    log("Super Admin Navigation - Verifying that the user is on the homepage");
    cy.contains("Find a grant");
  });

  it("Can change grant ownership", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();

    log("Super Admin Change Grant Ownership - Signing in as super admin");
    signInAsSuperAdmin();

    log(
      "Super Admin Change Grant Ownership - Entering admin email in search box",
    );
    cy.get("[name=searchTerm]").type(Cypress.env("oneLoginAdminEmail"));

    log("Super Admin Change Grant Ownership - Clicking search button");
    cy.get("[data-cy=cy-button-Search]").click();

    log("Super Admin Change Grant Ownership - Clicking edit on admin user");
    cy.get(
      '[data-cy="cy_table_row-for-Actions-row-0-cell-3"] > .govuk-link',
    ).click();

    log("Super Admin Change Grant Ownership - Clicking change on first grant");
    selectActionForItemInTable(
      TEST_V1_INTERNAL_GRANT.schemeName,
      "Change owner",
    );

    log(
      "Super Admin Change Grant Ownership - Entering an email address not registered in the system",
    );
    cy.get('[data-cy="cy-emailAddress-text-input"]').type("blah@blah.com");

    log("Super Admin Change Grant Ownership - Clicking continue");
    clickText("Confirm");
    cy.get(
      '[data-cy="cy-emailAddress-input-validation-error-details"]',
    ).contains("Email address does not belong to an admin user");

    log(
      "Super Admin Change Grant Ownership - Entering a non-admin email address",
    );
    cy.get('[data-cy="cy-emailAddress-text-input"]').clear();
    cy.get('[data-cy="cy-emailAddress-text-input"]').type(
      Cypress.env("oneLoginApplicantEmail"),
    );

    log("Super Admin Change Grant Ownership - Clicking continue");
    clickText("Confirm");
    cy.get(
      '[data-cy="cy-emailAddress-input-validation-error-details"]',
    ).contains("Email address does not belong to an admin user");

    log(
      "Super Admin Change Grant Ownership - Entering an invalid email address",
    );
    cy.get('[data-cy="cy-emailAddress-text-input"]').clear();
    cy.get('[data-cy="cy-emailAddress-text-input"]').type("blah");

    log("Super Admin Change Grant Ownership - Clicking continue");
    clickText("Confirm");
    cy.get(
      '[data-cy="cy-emailAddress-input-validation-error-details"]',
    ).contains("Please enter a valid email address");

    log(
      "Super Admin Change Grant Ownership - Entering the admin's email address",
    );
    cy.get('[data-cy="cy-emailAddress-text-input"]').clear();
    cy.get('[data-cy="cy-emailAddress-text-input"]').type(
      Cypress.env("oneLoginAdminEmail"),
    );

    log("Super Admin Change Grant Ownership - Clicking continue");
    clickText("Confirm");
    cy.get(
      '[data-cy="cy-emailAddress-input-validation-error-details"]',
    ).contains("This user already owns this grant");

    log(
      "Super Admin Change Grant Ownership - Entering the super admin's email address",
    );
    cy.get('[data-cy="cy-emailAddress-text-input"]').clear();
    cy.get('[data-cy="cy-emailAddress-text-input"]').type(
      Cypress.env("oneLoginSuperAdminEmail"),
    );

    log("Super Admin Change Grant Ownership - Clicking continue");
    clickText("Confirm");

    log("Super Admin Change Grant Ownership - Clicking confirm");
    clickText("Confirm transfer");

    log("Super Admin Change Grant Ownership - Hitting back button");
    cy.get('[data-cy="cy-back-button"]').click();

    log(
      "Super Admin Change Grant Ownership - Entering super admin email in search box",
    );
    cy.get("[name=searchTerm]").type(Cypress.env("oneLoginSuperAdminEmail"));

    cy.get("[data-cy=cy-button-Search]").click();

    log(
      "Super Admin Change Grant Ownership - Clicking edit on super admin user",
    );
    cy.get(
      '[data-cy="cy_table_row-for-Actions-row-0-cell-3"] > .govuk-link',
    ).click();

    log(
      "Super Admin Change Grant Ownership - Verifying that the grant appears in the list",
    );
    validateActionForItemInTable(
      TEST_V1_INTERNAL_GRANT.schemeName,
      "Change owner",
    );

    log("Super Admin Change Grant Ownership - Navigate to admin dashboard");
    cy.get('[data-cy="cy-back-button"]').click();
    cy.get('[data-cy="cyadminDashPageLink"] > .govuk-link').click();

    log(
      "Super Admin Change Grant Ownership - Checking grant shows in admin dashboard",
    );
    cy.get('[data-cy="cy_table_row"] > :nth-child(1)').should(
      "contain.text",
      "Cypress - Test Scheme V1",
    );
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

  it("Can reconnect to spotlight", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    log("Super Admin Reconnect Spotlight - Signing in as super admin");
    signInAsSuperAdmin();
    cy.task(ADD_FAILED_OAUTH_AUDIT);
    clickText("Integrations");
    log("Super Admin Reconnect Spotlight - Reconnecting to Spotlight");
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

    log("Super Admin Manage Roles - Expecting to land on super admin dashbard");
    cy.contains("Manage users");
  });

  it("Can manage departments", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    log("Super Admin Manage Depts - Signing in as super admin");
    signInAsSuperAdmin();
    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    log("Super Admin Manage Depts - Clicking change on user's department");
    selectActionForItemInTable(ORIGINAL_DEPARTMENT_NAME, "Change", {
      textCellElement: "dd",
      actionCellElement: "dd",
    });
    cy.get(".govuk-link").contains("Manage departments").click();

    log("Super Admin Manage Depts - Adding department");
    cy.get(".govuk-button").contains("Add new department").click();

    log("Super Admin Manage Depts - Trying to submit empty form data");
    cy.get(".govuk-button").contains("Add department").click();
    cy.get('[data-cy="cyErrorBannerHeading"]').contains("There is a problem");
    cy.get('[data-cy="cyError_ggisID"]').contains("Enter a GGIS ID");
    cy.get('[data-cy="cyError_name"]').contains("Enter a Department name");

    log("Super Admin Manage Depts - Entering a name but no ID");
    cy.get('[data-cy="cy-name-text-input"]').type(ADDED_DEPARTMENT_NAME);
    cy.get(".govuk-button").contains("Add department").click();
    cy.get('[data-cy="cyErrorBannerHeading"]').contains("There is a problem");
    cy.get('[data-cy="cyError_ggisID"]').contains("Enter a GGIS ID");

    log("Super Admin Manage Depts - Entering an ID but no name");
    cy.get('[data-cy="cy-name-text-input"]').clear();
    cy.get('[data-cy="cy-ggisID-text-input"]').type("123456");
    cy.get(".govuk-button").contains("Add department").click();
    cy.get('[data-cy="cyErrorBannerHeading"]').contains("There is a problem");
    cy.get('[data-cy="cyError_name"]').contains("Enter a Department name");

    log("Super Admin Manage Depts - Entering a valid ID and name");
    cy.get('[data-cy="cy-name-text-input"]').type(ADDED_DEPARTMENT_NAME);
    cy.get(".govuk-button").contains("Add department").click();

    log(
      "Super Admin Manage Depts - Verifying that the department has been added",
    );
    cy.get(".govuk-summary-list__key").contains(ADDED_DEPARTMENT_NAME);

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    log("Super Admin Manage Depts - Clicking change on user's department");
    selectActionForItemInTable(ORIGINAL_DEPARTMENT_NAME, "Change", {
      textCellElement: "dd",
      actionCellElement: "dd",
    });
    cy.get(".govuk-link").contains("Manage departments").click();

    log("Super Admin Manage Depts - Clicking edit on department");

    selectActionForItemInTable(DEPARTMENT_NAME, "Edit");

    log("Super Admin Manage Depts - Trying to submit empty form data");
    cy.get('[data-cy="cy-name-text-input"]').clear();
    cy.get('[data-cy="cy-ggisID-text-input"]').clear();
    cy.get(".govuk-button").contains("Save changes").click();
    cy.get('[data-cy="cyErrorBannerHeading"]').contains("There is a problem");
    cy.get('[data-cy="cyError_ggisID"]').contains("Enter a GGIS ID");
    cy.get('[data-cy="cyError_name"]').contains("Enter a Department name");

    log("Super Admin Manage Depts - Entering a name but no ID");
    cy.get('[data-cy="cy-name-text-input"]').clear();
    cy.get('[data-cy="cy-ggisID-text-input"]').clear();
    cy.get('[data-cy="cy-name-text-input"]').type(EDITED_DEPARTMENT_NAME);
    cy.get(".govuk-button").contains("Save changes").click();
    cy.get('[data-cy="cyErrorBannerHeading"]').contains("There is a problem");
    cy.get('[data-cy="cyError_ggisID"]').contains("Enter a GGIS ID");

    log("Super Admin Manage Depts - Entering an ID but no name");
    cy.get('[data-cy="cy-name-text-input"]').clear();
    cy.get('[data-cy="cy-ggisID-text-input"]').clear();
    cy.get('[data-cy="cy-ggisID-text-input"]').type("123456");
    cy.get(".govuk-button").contains("Save changes").click();
    cy.get('[data-cy="cyErrorBannerHeading"]').contains("There is a problem");
    cy.get('[data-cy="cyError_name"]').contains("Enter a Department name");

    log("Super Admin Manage Depts - Entering a valid ID and name");
    cy.get('[data-cy="cy-name-text-input"]').clear();
    cy.get('[data-cy="cy-ggisID-text-input"]').clear();
    cy.get('[data-cy="cy-name-text-input"]').type(EDITED_DEPARTMENT_NAME);
    cy.get('[data-cy="cy-ggisID-text-input"]').type("123456");
    cy.get(".govuk-button").contains("Save changes").click();

    log(
      "Super Admin Manage Depts - Verifying that the department has been edited",
    );
    cy.get(".govuk-summary-list__key").contains(EDITED_DEPARTMENT_NAME);

    clickBack();

    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    log("Super Admin Manage Depts - Clicking change on user's department");
    selectActionForItemInTable(ORIGINAL_DEPARTMENT_NAME, "Change", {
      textCellElement: "dd",
      actionCellElement: "dd",
    });
    cy.get(".govuk-link").contains("Manage departments").click();

    log("Super Admin Manage Depts - Clicking delete on department");

    selectActionForItemInTable(DEPARTMENT_NAME_DELETE, "Edit");

    log("Super Admin Manage Depts - Clicking delete department");
    cy.get(".govuk-button").contains("Delete department").click();

    log("Super Admin Manage Depts - Confirming delete department");
    cy.get(".govuk-button").contains("Delete department").click();

    log(
      "Super Admin Manage Depts - Verifying that the department has been deleted",
    );
    cy.get(".govuk-summary-list__key")
      .contains(DEPARTMENT_NAME_DELETE)
      .should("not.exist");
  });
});

const reconnectSpotlight = () => {
  assert200(cy.contains("Reconnect"));
};
