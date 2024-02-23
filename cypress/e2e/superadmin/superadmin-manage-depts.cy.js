import {
  clickBack,
  log,
  navigateToSpecificUser,
  selectActionForItemInTable,
  signInAsSuperAdmin,
  signInToIntegrationSite,
} from "../../common/common";

const firstUserId = Cypress.env("firstUserId");

const ORIGINAL_DEPARTMENT_NAME = `Cypress - Test Department -${firstUserId}`;
const ADDED_DEPARTMENT_NAME = `Cypress - Test Add Department -${firstUserId}`;
const DEPARTMENT_NAME_DELETE = `Cypress - Test Department -${firstUserId} Delete`;
const DEPARTMENT_NAME = `Cypress - Test Department -${firstUserId} Edit`;
const EDITED_DEPARTMENT_NAME = `Cypress - Test Edited Department -${firstUserId}`;

describe("Super Admin", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    signInToIntegrationSite();
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
