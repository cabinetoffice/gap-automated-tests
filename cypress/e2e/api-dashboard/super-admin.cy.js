import { describe } from "mocha";
import {
  BASE_URL,
  signInAsSuperAdmin,
  signInToIntegrationSite,
} from "../../common/common";

const today = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const firstUserId = Cypress.env("firstUserId");

const API_DASHBOARD_BASE_URL = BASE_URL + "/find/api/admin";
const SUPER_ADMIN_DASHBOARD = `${BASE_URL}/apply/admin/super-admin-dashboard`;
const ORG_1 = `CypressApiKeysEvilOrg-${firstUserId}`;
const ORG_2 = `CypressApiKeysTestOrg-${firstUserId}`;

const KEY_NAME = `Org1Cypress001-${firstUserId}`;

describe("Api Dashboard SuperAdmin journeys", () => {
  describe("Navigation test", () => {
    before(() => {
      cy.task("setUpUser");
      cy.task("setUpApplyData");
    });

    beforeEach(() => {
      signInToIntegrationSite();

      cy.log("Clicking Sign in as a superAdmin");
      cy.get("[data-cy=cySignInAndApply-Link]").click();

      signInAsSuperAdmin();

      cy.log("Clicking Manage API Keys");
      cy.get('[data-cy="cytechnicalDashPageLink"] > .govuk-link').click();
    });

    it("Should have correct navBar items for the superAdmin role, and check if link works", () => {
      cy.log(
        "Should have correct navBar items for the superAdmin role, and check if link works - Checking navBar items are correct for the superAdmin role",
      );
      cy.get('[data-cy="header-navbar-back-to-dashboard-link"]').contains(
        "Super admin dashboard",
      );

      cy.log(
        "Should have correct navBar items for the superAdmin role, and check if link works - Clicking on the link to the superAdmin dashboard",
      );
      cy.get('[data-cy="header-navbar-back-to-dashboard-link"]')
        .contains("Super admin dashboard")
        .click();

      cy.log(
        "Should have correct navBar items for the superAdmin role, and check if link works - Verifying link to the superAdmin dashboard is correct",
      );
      cy.contains("Manage users");

      cy.visit(SUPER_ADMIN_DASHBOARD);
      cy.log("Signing out");
      cy.get('[data-cy="cy_SignOutLink"]').click();

      cy.log("Signing out - Verifying that the user is on the homepage");
      cy.contains("Find a grant");
    });
  });

  describe("API Keys page", () => {
    before(() => {
      cy.task("setUpUser");
      cy.task("setUpApplyData");
      cy.task("create11ApiKeys", {}, { timeout: 100000 });
    });

    beforeEach(() => {
      signInToIntegrationSite();

      cy.log("Clicking sign in as a superAdmin");
      cy.get("[data-cy=cySignInAndApply-Link]").click();

      signInAsSuperAdmin();

      cy.log("Clicking Manage API Keys");
      cy.get('[data-cy="cytechnicalDashPageLink"] > .govuk-link').click();
    });

    it("Should show API keys in the table, organisations in the filters bar and any pagination required", () => {
      cy.log(
        "Should show API keys in the table, organisations in the filters bar and any pagination required - Checking the filters bar",
      );
      cy.get(`[data-cy="admin-dashboard-heading"]`)
        .should("be.visible")
        .should("have.text", "Manage API keys");
      cy.get(`[data-cy="admin-dashboard-active-key-count"]`)
        .should("be.visible")
        .should("contain", "active API keys");
      cy.get('[data-cy="admin-dashboard-filter-departments-div"]')
        .should("be.visible")
        .find('input[type="checkbox"]')
        .its("length")
        .should("be.gte", 2);
      cy.get(`[data-cy="admin-dashboard-filter-${ORG_1}-checkbox"]`).should(
        "not.be.checked",
      );
      cy.get(`[data-cy="admin-dashboard-filter-${ORG_1}-label"]`).should(
        "have.text",
        ORG_1,
      );
      cy.get(`[data-cy="admin-dashboard-filter-${ORG_2}-checkbox"]`).should(
        "not.be.checked",
      );
      cy.get(`[data-cy="admin-dashboard-filter-${ORG_2}-label"]`).should(
        "have.text",
        ORG_2,
      );
      cy.get(`[data-cy="admin-dashboard-filter-apply-button"]`).should(
        "be.visible",
      );
      cy.get(`[data-cy="admin-dashboard-filter-clear-button"]`).should(
        "be.visible",
      );
      cy.get('[data-cy="admin-dashboard-list-table-headers"]')
        .should("be.visible")
        .find("th")
        .should("have.length", 4);
      cy.get(`[data-cy="admin-dashboard-list-table-API-key-header"]`).should(
        "have.text",
        "API key",
      );
      cy.get(`[data-cy="admin-dashboard-list-table-Department-header"]`).should(
        "have.text",
        "Department",
      );
      cy.get(`[data-cy="admin-dashboard-list-table-Created-header"]`).should(
        "have.text",
        "Created",
      );
      cy.get(`[data-cy="admin-dashboard-list-table-Revoke-header"]`).should(
        "have.text",
        "Revoke",
      );

      cy.log(
        "Should show API keys in the table, organisations in the filters bar and any pagination required - Checking the rows content",
      );
      cy.get(`[data-cy="admin-dashboard-list-table-body"]`)
        .should("be.visible")
        .find("tr")
        .its("length")
        .should("be.gte", 10);
    });

    it(`API Key filters - Selecting ${ORG_2} in the filter`, () => {
      cy.log(
        `API Key filters - Selecting ${ORG_2} in the filter | applying filters`,
      );
      cy.get(`[data-cy="admin-dashboard-filter-${ORG_2}-checkbox"]`).click();
      cy.get(`[data-cy="admin-dashboard-filter-${ORG_2}-checkbox"]`).should(
        "be.checked",
      );
      cy.get(`[data-cy="admin-dashboard-filter-apply-button"]`).click();
      cy.url().should(
        "eq",
        `${API_DASHBOARD_BASE_URL}/api-keys/manage?selectedDepartments=${ORG_2}`,
      );

      cy.get(`[data-cy="admin-dashboard-filter-${ORG_2}-checkbox"]`).should(
        "be.checked",
      );

      cy.log(
        `API Key filters - Selecting ${ORG_2} in the filter | clearing filters`,
      );

      cy.get(`[data-cy="admin-dashboard-filter-clear-button"]`).click();

      cy.log(
        `API Key filters - Selecting ${ORG_2} in the filter | check that filters are unchecked`,
      );
      cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys/manage`);
      cy.get(`[data-cy="admin-dashboard-filter-${ORG_1}-checkbox"]`).should(
        "not.be.checked",
      );
      cy.get(`[data-cy="admin-dashboard-filter-${ORG_2}-checkbox"]`).should(
        "not.be.checked",
      );
    });

    it("Should be able to revoke any key from any department", () => {
      cy.get(`[data-cy="admin-dashboard-filter-${ORG_2}-checkbox"]`).click();
      cy.get(`[data-cy="admin-dashboard-filter-apply-button"]`).click();

      cy.log(
        "Should be able to revoke any key from any department - Clicking revoke key link",
      );
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Revoked-${KEY_NAME}-link"]`,
      ).click();

      cy.log(
        "Should be able to revoke any key from any department - Verify that the url contain the right path",
      );
      cy.url().should("include", `/api-keys/revoke/`);

      cy.log(
        "Should be able to revoke any key from any department - Click on cancel button",
      );
      cy.get(`[data-cy="revoke-cancel-button"]`).click();

      cy.log(
        "Should be able to revoke any key from any department - Verify that the url contain the right path",
      );
      cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys/manage`);

      cy.log(
        `Should be able to revoke any key from any department - Clicking revoke key link for key ${KEY_NAME}`,
      );
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Revoked-${KEY_NAME}-link"]`,
      ).click();

      cy.log(
        "Should be able to revoke any key from any department - Verify that the url contain the right path",
      );
      cy.url().should("include", `${API_DASHBOARD_BASE_URL}/api-keys/revoke/`);

      // test revoke button
      cy.log(
        "Should be able to revoke any key from any department - clicking revoke button in revoke page",
      );
      cy.get("form").within(() => {
        cy.get(`[data-cy="revoke-revoke-button"]`).click();
      });

      cy.log(
        "Should be able to revoke any key from any department - Verify that the url contain the right path",
      );
      cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys/manage`);

      cy.get(`[data-cy="admin-dashboard-filter-${ORG_2}-checkbox"]`).click();
      cy.get(`[data-cy="admin-dashboard-filter-apply-button"]`).click();

      cy.log(
        `Should be able to revoke any key from any department - Verify that the key ${KEY_NAME} is revoked`,
      );
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Revoked-${KEY_NAME}-link"]`,
      ).should("not.exist");
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-API-key-${KEY_NAME}"]`,
      ).should("have.text", `${KEY_NAME}`);
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Department-${KEY_NAME}"]`,
      ).should("have.text", ORG_2);
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Created-${KEY_NAME}"]`,
      ).should("have.text", today);
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Revoked-${KEY_NAME}-date"]`,
      ).should("contain", today);
      cy.get(`[data-cy="admin-dashboard-active-key-count"]`)
        .should("be.visible")
        .should("contain", "active API keys");
    });

    it("Show error page when trying to access Technical support dashboard page", () => {
      cy.log(
        "Show error page when trying to access Technical support dashboard page - Trying access Technical support dashboard page",
      );

      cy.visit(`${API_DASHBOARD_BASE_URL}/api-keys`, {
        failOnStatusCode: false,
      });
      cy.get(`[data-cy='error-heading']`).should(
        "have.text",
        "Something went wrong",
      );
      cy.get(`[data-cy='error-paragraph']`).should(
        "have.text",
        "Something went wrong while trying to complete your request.",
      );
      cy.get(`[data-cy='error-back-link']`).should(
        "have.attr",
        "href",
        "https://find-government-grants.service.gov.uk/", // this value is hard coded into the service and will need fixed.
      );
    });
  });
});
