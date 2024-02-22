import {
  filterSelection,
  log,
  signInAsSuperAdmin,
  signInToIntegrationSite,
} from "../../common/common";

const firstUserId = Cypress.env("firstUserId");

const ORIGINAL_DEPARTMENT_NAME = `Cypress - Test Department -${firstUserId}`;

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

    log("Super Admin Navigation - Dashboard Header Link");
    // SA DASHBOARD
    validateDashboardLink(false);
    // ADMIN DASHBOARD
    cy.get('[data-cy="cyadminDashPageLink"] > .govuk-link').click();
    validateDashboardLink(false);
    // MANAGE API KEYS
    cy.get('[data-cy="cytechnicalDashPageLink"] > .govuk-link').click();
    cy.get('[data-cy="header-navbar-back-to-dashboard-link"]')
      .should("have.attr", "href", SUPER_ADMIN_DASHBOARD)
      .click();
    // INTEGRATIONS
    cy.get('[data-cy="cyintegrationsPageLink"] > .govuk-link').click();
    validateDashboardLink(false);
    // APPLICANT DASHBOARD - appending BASE URL to href
    cy.get('[data-cy="cyapplicantDashPageLink"] > .govuk-link').click();
    validateDashboardLink(true);
    // FIND HOME - appending BASE URL to href
    cy.get('[data-cy="cyhomePageLink"] > .govuk-link').click();
    validateDashboardLink(true);

    log("Super Admin Navigation - Signing out");
    cy.get('[data-cy="cy_SignOutLink"]').click();

    log("Super Admin Navigation - Verifying that the user is on the homepage");
    cy.contains("Find a grant");
  });
});

const validateDashboardLink = (appendBaseUrl) => {
  const dashboardLink = cy.get(".super-admin-link > .govuk-header__link");
  const dashboardHref = appendBaseUrl
    ? SUPER_ADMIN_DASHBOARD
    : "/apply/admin/super-admin-dashboard";
  dashboardLink.should("have.attr", "href", dashboardHref);
  // navigate to SA dashboard link
  dashboardLink.click();
};
