import { after, describe } from "mocha";
import {
  BASE_URL,
  log,
  signInAsSuperAdmin,
  signInToIntegrationSite,
} from "../../common/common";
import { checkFirst10RowsContent } from "./helper";

const today = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const API_DASHBOARD_BASE_URL = BASE_URL + "/find/api/admin";
const SUPER_ADMIN_DASHBOARD = `${BASE_URL}/apply/admin/super-admin-dashboard`;

describe("Api Dashboard SuperAdmin journeys", () => {
  after(() => {
    cy.task("deleteApiKeys"); // deletes the 110 apiKeys created, so there won't stay in the db till next run
  });

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

  describe("With Api Keys", () => {
    let originalData;
    before(() => {
      cy.task("setUpUser");
      cy.task("setUpApplyData");
      cy.task("grabExistingApiKeysFromDb").then((data) => {
        originalData = data;

        cy.task("deleteExistingApiKeysFromDb", originalData);
      });
      cy.task("create110ApiKeys", {}, { timeout: 300000 });
    });

    beforeEach(() => {
      signInToIntegrationSite();

      cy.log("Clicking Sign in as a superAdmin");
      cy.get("[data-cy=cySignInAndApply-Link]").click();

      signInAsSuperAdmin();

      cy.log("Clicking Manage API Keys");
      cy.get('[data-cy="cytechnicalDashPageLink"] > .govuk-link').click();
    });

    it("Should show 11 keys, 2 organisation in the filters and the pagination bar", () => {
      cy.log(
        "Should show 11 keys, 2 organisation in the filters and the pagination bar - Checking the filter side",
      );
      cy.get(`[data-cy="admin-dashboard-heading"]`)
        .should("be.visible")
        .should("have.text", "Manage API keys");
      cy.get(`[data-cy="admin-dashboard-active-key-count"]`)
        .should("be.visible")
        .should("have.text", "11 active API keys");
      cy.get('[data-cy="admin-dashboard-filter-departments-div"]')
        .should("be.visible")
        .find('input[type="checkbox"]')
        .should("have.length", 2);
      cy.get(
        `[data-cy="admin-dashboard-filter-CypressApiKeysEvilOrg-checkbox"]`,
      ).should("not.be.checked");
      cy.get(
        `[data-cy="admin-dashboard-filter-CypressApiKeysEvilOrg-label"]`,
      ).should("have.text", "CypressApiKeysEvilOrg");
      cy.get(
        `[data-cy="admin-dashboard-filter-CypressApiKeysTestOrg-checkbox"]`,
      ).should("not.be.checked");
      cy.get(
        `[data-cy="admin-dashboard-filter-CypressApiKeysTestOrg-label"]`,
      ).should("have.text", "CypressApiKeysTestOrg");
      cy.get(`[data-cy="admin-dashboard-filter-apply-button"]`).should(
        "be.visible",
      );
      cy.get(`[data-cy="admin-dashboard-filter-clear-button"]`).should(
        "be.visible",
      );

      cy.log(
        "Should show 11 keys, 2 organisation in the filters and the pagination bar - Checking the table side",
      );

      cy.log(
        "Should show 11 keys, 2 organisation in the filters and the pagination bar - Checking the table headers",
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
        "Should show 11 keys, 2 organisation in the filters and the pagination bar - Checking the rows content",
      );
      cy.get(`[data-cy="admin-dashboard-list-table-body"]`)
        .should("be.visible")
        .find("tr")
        .should("have.length", 10);

      // first 10 single rows content
      checkFirst10RowsContent(today);

      cy.log(
        "Should show 11 keys, 2 organisation in the filters and the pagination bar - Checking the pagination bar",
      );
      cy.get('[data-cy="admin-dashboard-pagination-bar"]').should("exist");
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 1 to 10 of 11 keys",
      );
    });

    it("Should show only the filtered keys when department filters are set, and clear all filters should reset those filter", () => {
      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - Selecting CypressApiKeysTestOrg in the filter",
      );
      cy.get(
        `[data-cy="admin-dashboard-filter-CypressApiKeysTestOrg-checkbox"]`,
      ).click();

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - verifying that the checkbox is checked",
      );
      cy.get(
        `[data-cy="admin-dashboard-filter-CypressApiKeysTestOrg-checkbox"]`,
      ).should("be.checked");

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - Clicking Apply filters",
      );
      cy.get(`[data-cy="admin-dashboard-filter-apply-button"]`).click();

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - Verify that the url contain the selected department",
      );
      cy.url().should(
        "eq",
        `${API_DASHBOARD_BASE_URL}/api-keys/manage?selectedDepartments=CypressApiKeysTestOrg`,
      );

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - verifying that the checkbox is checked",
      );
      cy.get(
        `[data-cy="admin-dashboard-filter-CypressApiKeysTestOrg-checkbox"]`,
      ).should("be.checked");

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - Checking the rows",
      );
      cy.get(`[data-cy="admin-dashboard-list-table-body"]`)
        .should("be.visible")
        .find("tr")
        .should("have.length", 6);

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - Checking the pagination bar",
      );

      // pagination(when less than 5 pages, no ellipses and all the pages showing in the pagination bar)
      cy.get(`[data-cy="admin-dashboard-pagination-ellipses"]`).should(
        "not.exist",
      );
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 1 to 6 of 6 keys",
      );

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - Selecting also CypressApiKeysEvilOrg in the filter",
      );
      cy.get(
        `[data-cy="admin-dashboard-filter-CypressApiKeysEvilOrg-checkbox"]`,
      ).click();
      cy.get(
        `[data-cy="admin-dashboard-filter-CypressApiKeysEvilOrg-checkbox"]`,
      ).should("be.checked");

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - Clicking Apply filters",
      );
      cy.get(`[data-cy="admin-dashboard-filter-apply-button"]`).click();

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - Verify that the url contain the selected departments",
      );
      cy.url().should("include", "selectedDepartments=CypressApiKeysEvilOrg");
      cy.url().should("include", "selectedDepartments=CypressApiKeysTestOrg");

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - Checking the rows",
      );
      cy.get(`[data-cy="admin-dashboard-list-table-body"]`)
        .should("be.visible")
        .find("tr")
        .should("have.length", 10);

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - Checking the pagination bar",
      );
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 1 to 10 of 11 keys",
      );

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - Clicking Clear all filters",
      );
      cy.get(`[data-cy="admin-dashboard-filter-clear-button"]`).click();

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - Verify that the url contain no departments",
      );
      cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys/manage`);

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - verifying that the checkboxes are not checked",
      );
      cy.get(
        `[data-cy="admin-dashboard-filter-CypressApiKeysTestOrg-checkbox"]`,
      ).should("not.be.checked");
      cy.get(
        `[data-cy="admin-dashboard-filter-CypressApiKeysEvilOrg-checkbox"]`,
      ).should("not.be.checked");

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - Checking the rows",
      );
      cy.get(`[data-cy="admin-dashboard-list-table-body"]`)
        .should("be.visible")
        .find("tr")
        .should("have.length", 10);

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - Checking the pagination bar",
      );
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 1 to 10 of 11 keys",
      );
    });

    it("Should be able to revoke any key from any department", () => {
      cy.log(
        "Should be able to revoke any key from any department - Clicking revoke key link",
      );
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Revoked-Org1Cypress005-link"]`,
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
        "Should be able to revoke any key from any department - Clicking revoke key link for key Org1Cypress001",
      );
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Revoked-Org1Cypress001-link"]`,
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

      // once revoked the revoked key will be at the last page
      cy.log(
        "Should be able to revoke any key from any department - Clicking on link for page 2(last page)",
      );
      cy.get(`[data-cy="admin-dashboard-pagination-page-2-link"]`).click();

      cy.log(
        "Should be able to revoke any key from any department - Verify that the key Org1Cypress001 is revoked",
      );
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Revoked-Org1Cypress001-link"]`,
      ).should("not.exist");
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-API-key-Org1Cypress001"]`,
      ).should("have.text", `Org1Cypress001`);
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Department-Org1Cypress001"]`,
      ).should("have.text", "CypressApiKeysTestOrg");
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Created-Org1Cypress001"]`,
      ).should("have.text", today);
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Revoked-Org1Cypress001-date"]`,
      ).should("contain", today);
      cy.get(`[data-cy="admin-dashboard-active-key-count"]`)
        .should("be.visible")
        .should("have.text", "10 active API keys");
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

    /*
      If tests inside the scope fail then the `after` blocks won't run and that will prevent us from re-populating the API keys table. 
      This "test" will run every time regardless of previous failures. 
    */
    it("Should re-populate the database with existing API keys", () => {
      log("re-populating API keys table");
      cy.task("refillDbWithPreExistingApiKeys", originalData);
    });
  });
});
