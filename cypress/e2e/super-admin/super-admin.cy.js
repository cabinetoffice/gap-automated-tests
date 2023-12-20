import {
  signInAsSuperAdmin,
  signInToIntegrationSite,
  clickText,
  assert200,
  navigateToSpecificUser,
  signInAsApplyApplicant,
} from "../../common/common";
import {
  TEST_V1_INTERNAL_GRANT,
  ADDED_DEPARTMENT_NAME,
} from "../../common/constants";
import { TASKS } from "./constants";

const { ADD_TEST_OAUTH_AUDIT, DELETE_FAILED_OAUTH_AUDIT } = TASKS;

describe("Navigation", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Can land on super admin dashboard", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();

    signInAsSuperAdmin();

    cy.contains("Manage users");
  });

  it("Can navigate home", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();

    cy.log("Clicking Home");
    cy.get('[data-cy="cyhomePageLink"] > .govuk-link').click();

    cy.log("Verifying that the user is on the home page");
    cy.contains("Find a grant");
  });

  it("Can navigate to admin dashboard", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();

    cy.log("Clicking Admin dashboard");
    cy.get('[data-cy="cyadminDashPageLink"] > .govuk-link').click();

    cy.log("Verifying that the user is on the admin dashboard");
    cy.contains("Manage a grant");
  });

  it("Can navigate to applicant dashboard", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();

    cy.log("Clicking Applicant dashboard");
    cy.get('[data-cy="cyapplicantDashPageLink"] > .govuk-link').click();

    cy.log("Verifying that the user is on the applicant dashboard");
    cy.contains("View your applications");
  });

  it("Can view all users with pagination", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();

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

    cy.log("Expeting next page to be visible");
    cy.get(".govuk-pagination__next > .govuk-link").should("exist");
  });

  it("Can filter on users", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();

    cy.log("Filtering for super admins cypress");
    cy.get('[data-cy="cy-checkbox-value-4"]').click();
    cy.get(
      `[data-cy="cy-checkbox-value--${Cypress.env("firstUserId")}"]`,
    ).click();

    cy.log("Clicking filter");
    cy.get('[data-cy="cy-button-Apply filters"]').click();

    cy.log("Verifying filter");
    cy.get('[data-cy="cy_table_row-for-Email address-row-0-cell-0"]').contains(
      Cypress.env("oneLoginSuperAdminEmail"),
    );
  });

  it("Can view Manage API Keys", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();

    cy.log("Clicking Manage API Keys");
    cy.get('[data-cy="cytechnicalDashPageLink"] > .govuk-link').click();

    cy.log("Verifying that the user is on the Manage API Keys page");
    cy.get('[data-cy="admin-dashboard-heading"]').contains("Manage API keys");
  });

  it("Can sign out", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();

    cy.log("Signing out");
    cy.get('[data-cy="cy_SignOutLink"]').click();

    cy.log("Verifying that the user is on the homepage");
    cy.contains("Find a grant");
  });
});

describe("Manage Users", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
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
    cy.get(
      `[data-cy="cy_summaryListValue_${TEST_V1_INTERNAL_GRANT.schemeName}"] > .govuk-link`,
    ).click();

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
    cy.get(
      `[data-cy="cy_summaryListValue_${TEST_V1_INTERNAL_GRANT.schemeName}"] > .govuk-link`,
    ).should("exist");

    cy.log("Navigate to admin dashboard");
    cy.get('[data-cy="cy-back-button"]').click();
    cy.get('[data-cy="cyadminDashPageLink"] > .govuk-link').click();

    cy.log("Checking grant shows in admin dashboard");
    cy.get('[data-cy="cy_table_row"] > :nth-child(1)').should(
      "contain.text",
      "Cypress - Test Scheme V1",
    );
  });

  it("Can view an applicant user", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
    navigateToSpecificUser(Cypress.env("oneLoginApplicantEmail"));

    cy.log("Veryfying that the user is an applicant");
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains("Applicant");

    cy.log("Veryfying the user doesn't have a department");
    cy.get('[data-cy="cy_summaryListValue_Department"]').should("not.exist");
  });

  it("Can view an admin user", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    cy.log("Veryfying that the user is an admin");
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains("Administrator");

    cy.log("Veryfying the user has a department");
    cy.get('[data-cy="cy_summaryListValue_Department"]').contains(
      "Cypress - Test Department",
    );
  });

  it("Can view a super admin user", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
    navigateToSpecificUser(Cypress.env("oneLoginSuperAdminEmail"));

    cy.log("Veryfying that the user is an admin");
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains(
      "Super administrator",
    );

    cy.log("Veryfying the user has a department");
    cy.get('[data-cy="cy_summaryListValue_Department"]').contains(
      "Cypress - Test Department",
    );
  });

  it("Can update a user's department", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    cy.log("Clicking change on user's department");
    cy.get(
      ":nth-child(3) > .govuk-summary-list__actions > .govuk-link",
    ).click();

    cy.log("Selecting a new department");
    cy.get('[data-cy="cy-radioInput-option-CabinetOffice"]').click();

    cy.log("Clicking change department");
    cy.get(".govuk-button").click();

    cy.log("Verifying that the user's department has changed");
    cy.get('[data-cy="cy_summaryListValue_Department"]').contains(
      "Cabinet Office",
    );
  });

  it("Can block and unblock a user", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
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
  });

  it("Can delete a user", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
    navigateToSpecificUser(Cypress.env("oneLoginApplicantEmail"));
    cy.log("Clicking delete user");
    cy.get(".govuk-button--warning").contains("Delete user").click();

    cy.log("Clicking delete user confirmation");
    cy.get(".govuk-button").contains("Delete user").click();

    cy.log("Verifying that the user is deleted");
    navigateToSpecificUser(Cypress.env("oneLoginApplicantEmail"));
    cy.get('[data-cy="cy_summaryListValue_Email"]').should(
      "not.contain",
      Cypress.env("oneLoginApplicantEmail"),
    );
    // More thorough check to be added
  });

  it("Can reconnect spotlight", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
    cy.task(ADD_TEST_OAUTH_AUDIT);
    clickText("Integrations");
    reconnectSpotlight();
    clickText("Integrations");
    cy.get("[data-cy='cy_table_row-for-Integration-row-0-cell-0']").contains(
      "Spotlight",
    );
    cy.get('[data-cy="cy_table_row-for-Status-row-0-cell-1"]');
    cy.get("[data-cy='cy_table_row-for-Status-row-0-cell-1']").contains(
      "Connected",
    );
    // cleanup
    cy.task(DELETE_FAILED_OAUTH_AUDIT);
  });
});

describe("Manage roles", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Can remove a user's roles", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    cy.log("Clicking remove on admin role");
    cy.get(
      ":nth-child(4) > .govuk-summary-list__actions > .govuk-link",
    ).click();

    cy.log("Unchecking admin role");
    cy.get('[data-cy="cy-checkbox-value-3"]').click();

    cy.log("Clicking change roles");
    cy.get(".govuk-button").contains("Change Roles").click();

    cy.log("Verifying that the user is now an applicant");
    cy.get('[data-cy="cy_summaryListValue_Roles"]').contains("Applicant");
  });

  it("Can login as applicant who has just been promoted to Super admin", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
    navigateToSpecificUser(Cypress.env("oneLoginApplicantEmail"));

    cy.log("Adding super admin role");
    cy.get(".govuk-summary-list__actions > .govuk-link").click();
    cy.get('[data-cy="cy-checkbox-value-4"]').click();
    cy.get(".govuk-button").contains("Change Roles").click();

    cy.log("Giving a department");
    cy.get(
      ":nth-child(3) > .govuk-summary-list__actions > .govuk-link",
    ).click();
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
});

describe("Manage departments", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("Can add a department", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    cy.log("Clicking change on user's department");
    cy.get(
      ":nth-child(3) > .govuk-summary-list__actions > .govuk-link",
    ).click();
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
  });

  it("Can edit a department", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    cy.log("Clicking change on user's department");
    cy.get(
      ":nth-child(3) > .govuk-summary-list__actions > .govuk-link",
    ).click();
    cy.get(".govuk-link").contains("Manage departments").click();

    cy.log("Clicking edit on department");

    let hits = 0;
    cy.get(".govuk-summary-list__key").each(($ele, index) => {
      if ($ele.text() === "Cypress - Test Edit Department" && hits === 0) {
        cy.get(
          `:nth-child(${
            index + 1
          }) > .govuk-summary-list__actions > .manage-departments_float-left-sm__8lYy9 > .govuk-link`,
        ).click();
        hits++;
      }
    });

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
    cy.get('[data-cy="cy-name-text-input"]').type(
      "Cypress - Test Edit Department 2",
    );
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
    cy.get('[data-cy="cy-name-text-input"]').type(
      "Cypress - Test Edit Department 2",
    );
    cy.get('[data-cy="cy-ggisID-text-input"]').type("123456");
    cy.get(".govuk-button").contains("Save changes").click();

    cy.log("Verifying that the department has been editted");
    cy.get(".govuk-summary-list__key").contains(
      "Cypress - Test Edit Department 2",
    );
  });

  it("Can delete a department", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
    navigateToSpecificUser(Cypress.env("oneLoginAdminEmail"));

    cy.log("Clicking change on user's department");
    cy.get(
      ":nth-child(3) > .govuk-summary-list__actions > .govuk-link",
    ).click();
    cy.get(".govuk-link").contains("Manage departments").click();

    cy.log("Clicking delete on department");
    let hits = 0;
    cy.get(".govuk-summary-list__key").each(($ele, index) => {
      if ($ele.text() === "Cypress - Test Delete Department" && hits === 0) {
        cy.get(
          `:nth-child(${
            index + 1
          }) > .govuk-summary-list__actions > .manage-departments_float-left-sm__8lYy9 > .govuk-link`,
        ).click();
        hits++;
      }
    });

    cy.log("Clicking delete department");
    cy.get(".govuk-button").contains("Delete department").click();

    cy.log("Confirming delete department");
    cy.get(".govuk-button").contains("Delete department").click();

    cy.log("Verifying that the department has been deleted");
    cy.get(".govuk-summary-list__key")
      .contains("Cypress - Test Delete Department")
      .should("not.exist");
  });
});

const reconnectSpotlight = () => {
  assert200(cy.contains("Reconnect"));
};
