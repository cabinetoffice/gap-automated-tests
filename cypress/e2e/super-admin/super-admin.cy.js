import {
  signInAsSuperAdmin,
  signInToIntegrationSite,
  clickText,
  assert200,
  navigateToSpecificUser,
} from "../../common/common";
import { TEST_V1_INTERNAL_GRANT } from "../../common/constants";
import { TASKS } from "./constants";

const { ADD_TEST_OAUTH_AUDIT, DELETE_FAILED_OAUTH_AUDIT } = TASKS;
const ADDED_DEPARTMENT_NAME = "Cypress Test Add Department";

describe("Manage Users", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
  });

  it("can land on super admin dashboard", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();

    signInAsSuperAdmin();

    cy.contains("Manage users");
  });

  it("can change grant ownership", () => {
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

  // it("Can view a tech support user", () => {
  //   cy.log("Signing in as super admin");
  //   signInAsSuperAdmin();
  //   navigateToSpecificUser(Cypress.env("oneLoginTechSupportEmail"));
  // });

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

  it("can reconnect spotlight", () => {
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

describe("Managing roles", () => {
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
