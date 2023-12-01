import {
  signInAsSuperAdmin,
  signInToIntegrationSite,
  clickText,
} from "../../common/common";
import { TEST_V1_INTERNAL_GRANT } from "../../common/constants";

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

  it("can reconnect spotlight", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    cy.log("Signing in as super admin");
    signInAsSuperAdmin();
    cy.task("addTestOauthAudit");
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
    //cleanup
    cy.task("deleteFailedOauthAudit");
  });
});

const reconnectSpotlight = () => {
  cy.contains("Reconnect")
    .invoke("attr", "href")
    .then((url) => {
      cy.request(url).then((response) => {
        expect(response.status).to.eq(200);
      });
    });
};
