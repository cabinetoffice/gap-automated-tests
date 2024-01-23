import { after, describe } from "mocha";
import {
  BASE_URL,
  signInAsSuperAdmin,
  signInToIntegrationSite,
} from "../../common/common";
import {
  checkFirst10RowsContent,
  paginationItemHasCurrentAsCssClass,
  paginationItemHasNotCurrentAsCssClass,
  paginationItemsDoesNotExist,
  paginationLinkHasTheRightHref,
  paginationNextItemHasTheRightHref,
  paginationPreviousItemHasTheRightHref,
} from "./helper";

const today = new Date().toLocaleDateString("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const API_DASHBOARD_BASE_URL = BASE_URL + "/find/api/admin";

describe("Api Dashboard SuperAdmin journeys", () => {
  after(() => {
    cy.task("deleteApiKeys"); // deletes the 110 apiKeys created, so there won't stay in the db till next run
  });

  describe("No API keys", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let originalData;
    before(() => {
      cy.task("setUpUser");
      cy.task("setUpApplyData");
      cy.task("grabExistingApiKeysFromDb").then((data) => {
        originalData = data;

        cy.task("deleteExistingApiKeysFromDb", originalData);
      });
    });

    beforeEach(() => {
      signInToIntegrationSite();

      cy.log("Clicking Sign in as a superAdmin");
      cy.get("[data-cy=cySignInAndApply-Link]").click();

      signInAsSuperAdmin();

      cy.log("Clicking Manage API Keys");
      cy.get('[data-cy="cytechnicalDashPageLink"] > .govuk-link').click();
    });

    after(() => {
      cy.task("refillDbWithPreExistingApiKeys", originalData);
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
    });

    it("Should show No keys message when no apiKeys are present", () => {
      cy.log(
        "Should show No keys message when no apiKeys are present - Checking the page content is correct when no apiKeys are present",
      );
      cy.get('[data-cy="header"]').should("be.visible");
      cy.get(`[data-cy="beta-banner"]`).should("be.visible");

      cy.log(
        "Should show No keys message when no apiKeys are present - Checking the filter side",
      );
      cy.get(`[data-cy="admin-dashboard-heading"]`)
        .should("be.visible")
        .should("have.text", "Manage API keys");
      cy.get(`[data-cy="admin-dashboard-active-key-count"]`)
        .should("be.visible")
        .should("have.text", "0 active API keys");

      cy.log(
        "Should show No keys message when no apiKeys are present - Checking the table side",
      );
      cy.get(`[data-cy="admin-dashboard-no-api-key-paragraph"]`)
        .should("be.visible")
        .should(
          "have.text",
          "No one has any API keys yet. When one is created, you will be able to see a list of all API keys, the department it belongs, when it was created and revoke access to them on this screen.",
        );
      cy.get(`[data-cy="admin-dashboard-pagination-bar"]`).should("not.exist");

      cy.log(
        "Should show No keys message when no apiKeys are present - Checking the footer",
      );
      cy.get(`[data-cy="footer"]`).should("be.visible");
    });

    it("Can sign out", () => {
      cy.log("Signing out");
      cy.get('[data-cy="header-sign-out-link"]').click();

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

    after(() => {
      cy.task("refillDbWithPreExistingApiKeys", originalData);
    });

    it("Should show 110 keys, 2 organisation in the filters and the pagination bar", () => {
      cy.log(
        "Should show 110 keys, 2 organisation in the filters and the pagination bar - Checking the filter side",
      );
      cy.get(`[data-cy="admin-dashboard-heading"]`)
        .should("be.visible")
        .should("have.text", "Manage API keys");
      cy.get(`[data-cy="admin-dashboard-active-key-count"]`)
        .should("be.visible")
        .should("have.text", "110 active API keys");
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
        "Should show 110 keys, 2 organisation in the filters and the pagination bar - Checking the table side",
      );

      cy.log(
        "Should show 110 keys, 2 organisation in the filters and the pagination bar - Checking the table headers",
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
        "Should show 110 keys, 2 organisation in the filters and the pagination bar - Checking the rows content",
      );
      cy.get(`[data-cy="admin-dashboard-list-table-body"]`)
        .should("be.visible")
        .find("tr")
        .should("have.length", 10);

      // first 10 single rows content
      checkFirst10RowsContent(today);

      cy.log(
        "Should show 110 keys, 2 organisation in the filters and the pagination bar - Checking the pagination bar",
      );
      cy.get('[data-cy="admin-dashboard-pagination-bar"]').should("exist");
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 1 to 10 of 110 keys",
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
        .should("have.length", 10);

      cy.log(
        "Should show only the filtered keys when department filters are set, and clear all filters should reset those filter - Checking the pagination bar",
      );
      // pagination(when less than 5 pages, no ellipses and all the pages showing in the pagination bar)
      cy.get(`[data-cy="admin-dashboard-pagination-ellipses"]`).should(
        "not.exist",
      );
      paginationLinkHasTheRightHref(1, "CypressApiKeysTestOrg");
      paginationLinkHasTheRightHref(2, "CypressApiKeysTestOrg");
      paginationLinkHasTheRightHref(3, "CypressApiKeysTestOrg");
      paginationLinkHasTheRightHref(4, "CypressApiKeysTestOrg");
      paginationLinkHasTheRightHref(5, "CypressApiKeysTestOrg");
      paginationNextItemHasTheRightHref(2, "CypressApiKeysTestOrg");
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 1 to 10 of 45 keys",
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
        "Showing 1 to 10 of 110 keys",
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
        "Showing 1 to 10 of 110 keys",
      );
    });

    // pagination tests
    it("Should show the correct pagination when going to next pages ", () => {
      // page 1
      cy.log(
        "Should show the correct pagination when going to next pages - Checking the pagination bar on page 1",
      );
      paginationItemHasCurrentAsCssClass(1);
      paginationLinkHasTheRightHref(1);
      paginationLinkHasTheRightHref(2);
      paginationItemHasNotCurrentAsCssClass(2);
      cy.get(`[data-cy="admin-dashboard-pagination-ellipses"]`).should("exist");
      paginationLinkHasTheRightHref(11);
      paginationItemHasNotCurrentAsCssClass(11);
      paginationNextItemHasTheRightHref(2);
      paginationItemsDoesNotExist([3, 4, 5, 6, 7, 8, 9, 10]);

      cy.log(
        "Should show the correct pagination when going to next pages - Clicking on link for page 2",
      );
      cy.get(`[data-cy="admin-dashboard-pagination-page-2-link"]`).click();

      // page 2
      cy.log(
        "Should show the correct pagination when going to next pages - Verify that the url contain the right page number",
      );
      cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys/manage?page=2`);

      cy.log(
        "Should show the correct pagination when going to next pages - Checking the pagination bar on page 2",
      );
      paginationPreviousItemHasTheRightHref(1);
      paginationLinkHasTheRightHref(1);
      paginationItemHasNotCurrentAsCssClass(1);
      paginationItemHasCurrentAsCssClass(2);
      paginationLinkHasTheRightHref(2);
      paginationLinkHasTheRightHref(3);
      paginationItemHasNotCurrentAsCssClass(3);
      cy.get(`[data-cy="admin-dashboard-pagination-ellipses"]`).should("exist");
      paginationLinkHasTheRightHref(11);
      paginationItemHasNotCurrentAsCssClass(11);
      paginationNextItemHasTheRightHref(3);
      paginationItemsDoesNotExist([4, 5, 6, 7, 8, 9, 10]);
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 11 to 20 of 110 keys",
      );

      cy.log(
        "Should show the correct pagination when going to next pages - Clicking on link for page 3",
      );
      cy.get(`[data-cy="admin-dashboard-pagination-page-3-link"]`).click();

      // page 3
      cy.log(
        "Should show the correct pagination when going to next pages - Verify that the url contain the right page number",
      );
      cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys/manage?page=3`);

      cy.log(
        "Should show the correct pagination when going to next pages - Checking the pagination bar on page 3",
      );
      paginationPreviousItemHasTheRightHref(2);
      paginationLinkHasTheRightHref(1);
      paginationItemHasNotCurrentAsCssClass(1);
      paginationLinkHasTheRightHref(2);
      paginationItemHasNotCurrentAsCssClass(2);
      paginationItemHasCurrentAsCssClass(3);
      paginationLinkHasTheRightHref(3);
      paginationLinkHasTheRightHref(4);
      paginationItemHasNotCurrentAsCssClass(4);
      cy.get(`[data-cy="admin-dashboard-pagination-ellipses"]`).should("exist");
      paginationLinkHasTheRightHref(11);
      paginationItemHasNotCurrentAsCssClass(11);
      paginationNextItemHasTheRightHref(4);
      paginationItemsDoesNotExist([5, 6, 7, 8, 9, 10]);
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 21 to 30 of 110 keys",
      );

      cy.log(
        "Should show the correct pagination when going to next pages - Clicking on link for page 4",
      );
      cy.get(`[data-cy="admin-dashboard-pagination-page-4-link"]`).click();

      // page 4
      cy.log(
        "Should show the correct pagination when going to next pages - Verify that the url contain the right page number",
      );
      cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys/manage?page=4`);

      cy.log(
        "Should show the correct pagination when going to next pages - Checking the pagination bar on page 4",
      );
      paginationPreviousItemHasTheRightHref(3);
      paginationLinkHasTheRightHref(1);
      paginationItemHasNotCurrentAsCssClass(1);
      paginationLinkHasTheRightHref(2);
      paginationItemHasNotCurrentAsCssClass(2);
      paginationLinkHasTheRightHref(3);
      paginationItemHasNotCurrentAsCssClass(3);
      paginationItemHasCurrentAsCssClass(4);
      paginationLinkHasTheRightHref(4);
      paginationLinkHasTheRightHref(5);
      paginationItemHasNotCurrentAsCssClass(5);
      cy.get(`[data-cy="admin-dashboard-pagination-ellipses"]`).should("exist");
      paginationLinkHasTheRightHref(11);
      paginationItemHasNotCurrentAsCssClass(11);
      paginationNextItemHasTheRightHref(5);
      paginationItemsDoesNotExist([6, 7, 8, 9, 10]);
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 31 to 40 of 110 keys",
      );

      cy.log(
        "Should show the correct pagination when going to next pages - Clicking on link for page 5",
      );
      cy.get(`[data-cy="admin-dashboard-pagination-page-5-link"]`).click();

      // page 5
      cy.log(
        "Should show the correct pagination when going to next pages - Verify that the url contain the right page number",
      );
      cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys/manage?page=5`);

      cy.log(
        "Should show the correct pagination when going to next pages - Checking the pagination bar on page 5",
      );
      paginationPreviousItemHasTheRightHref(4);
      paginationLinkHasTheRightHref(1);
      paginationItemHasNotCurrentAsCssClass(1);
      paginationLinkHasTheRightHref(4);
      paginationItemHasNotCurrentAsCssClass(4);
      paginationItemHasCurrentAsCssClass(5);
      paginationLinkHasTheRightHref(5);
      paginationLinkHasTheRightHref(6);
      paginationItemHasNotCurrentAsCssClass(6);
      cy.get(`[data-cy="admin-dashboard-pagination-ellipses"]`).should("exist");
      paginationLinkHasTheRightHref(11);
      paginationItemHasNotCurrentAsCssClass(11);
      paginationNextItemHasTheRightHref(6);
      paginationItemsDoesNotExist([2, 3, 7, 8, 9, 10]);
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 41 to 50 of 110 keys",
      );

      cy.log(
        "Should show the correct pagination when going to next pages - Clicking on link for page 6",
      );
      cy.get(`[data-cy="admin-dashboard-pagination-page-6-link"]`).click();

      // page 6
      cy.log(
        "Should show the correct pagination when going to next pages - Verify that the url contain the right page number",
      );
      cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys/manage?page=6`);

      cy.log(
        "Should show the correct pagination when going to next pages - Checking the pagination bar on page 6",
      );
      paginationPreviousItemHasTheRightHref(5);
      paginationLinkHasTheRightHref(1);
      paginationItemHasNotCurrentAsCssClass(1);
      paginationLinkHasTheRightHref(5);
      paginationItemHasNotCurrentAsCssClass(5);
      paginationItemHasCurrentAsCssClass(6);
      paginationLinkHasTheRightHref(6);
      paginationLinkHasTheRightHref(7);
      paginationItemHasNotCurrentAsCssClass(7);
      cy.get(`[data-cy="admin-dashboard-pagination-ellipses"]`).should("exist");
      paginationLinkHasTheRightHref(11);
      paginationItemHasNotCurrentAsCssClass(11);
      paginationNextItemHasTheRightHref(7);
      paginationItemsDoesNotExist([2, 3, 4, 8, 9, 10]);
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 51 to 60 of 110 keys",
      );

      cy.log(
        "Should show the correct pagination when going to next pages - Clicking on link for page 7",
      );
      cy.get(`[data-cy="admin-dashboard-pagination-page-7-link"]`).click();

      // page 7
      cy.log(
        "Should show the correct pagination when going to next pages - Verify that the url contain the right page number",
      );
      cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys/manage?page=7`);

      cy.log(
        "Should show the correct pagination when going to next pages - Checking the pagination bar on page 7",
      );
      paginationPreviousItemHasTheRightHref(6);
      paginationLinkHasTheRightHref(1);
      paginationItemHasNotCurrentAsCssClass(1);
      paginationLinkHasTheRightHref(6);
      paginationItemHasNotCurrentAsCssClass(6);
      paginationItemHasCurrentAsCssClass(7);
      paginationLinkHasTheRightHref(7);
      paginationLinkHasTheRightHref(8);
      paginationItemHasNotCurrentAsCssClass(8);
      cy.get(`[data-cy="admin-dashboard-pagination-ellipses"]`).should("exist");
      paginationLinkHasTheRightHref(11);
      paginationItemHasNotCurrentAsCssClass(11);
      paginationNextItemHasTheRightHref(8);
      paginationItemsDoesNotExist([2, 3, 4, 5, 9, 10]);
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 61 to 70 of 110 keys",
      );

      cy.log(
        "Should show the correct pagination when going to next pages - Clicking on link for page 8",
      );
      cy.get(`[data-cy="admin-dashboard-pagination-page-8-link"]`).click();

      // page 8
      cy.log(
        "Should show the correct pagination when going to next pages - Verify that the url contain the right page number",
      );
      cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys/manage?page=8`);

      cy.log(
        "Should show the correct pagination when going to next pages - Checking the pagination bar on page 8",
      );
      paginationPreviousItemHasTheRightHref(7);
      paginationLinkHasTheRightHref(1);
      paginationItemHasNotCurrentAsCssClass(1);
      paginationLinkHasTheRightHref(7);
      paginationItemHasNotCurrentAsCssClass(7);
      paginationItemHasCurrentAsCssClass(8);
      paginationLinkHasTheRightHref(8);
      paginationLinkHasTheRightHref(9);
      paginationItemHasNotCurrentAsCssClass(9);
      cy.get(`[data-cy="admin-dashboard-pagination-ellipses"]`).should("exist");
      paginationLinkHasTheRightHref(11);
      paginationItemHasNotCurrentAsCssClass(11);
      paginationNextItemHasTheRightHref(9);
      paginationItemsDoesNotExist([2, 3, 4, 5, 6, 10]);
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 71 to 80 of 110 keys",
      );

      cy.log(
        "Should show the correct pagination when going to next pages - Clicking on link for page 9",
      );
      cy.get(`[data-cy="admin-dashboard-pagination-page-9-link"]`).click();

      // page 9
      cy.log(
        "Should show the correct pagination when going to next pages - Verify that the url contain the right page number",
      );
      cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys/manage?page=9`);

      cy.log(
        "Should show the correct pagination when going to next pages - Checking the pagination bar on page 9",
      );
      paginationPreviousItemHasTheRightHref(8);
      paginationLinkHasTheRightHref(1);
      paginationItemHasNotCurrentAsCssClass(1);
      cy.get(`[data-cy="admin-dashboard-pagination-ellipses"]`).should("exist");
      paginationLinkHasTheRightHref(8);
      paginationItemHasNotCurrentAsCssClass(8);
      paginationItemHasCurrentAsCssClass(9);
      paginationLinkHasTheRightHref(9);
      paginationLinkHasTheRightHref(10);
      paginationItemHasNotCurrentAsCssClass(10);
      paginationLinkHasTheRightHref(11);
      paginationItemHasNotCurrentAsCssClass(11);
      paginationNextItemHasTheRightHref(10);
      paginationItemsDoesNotExist([2, 3, 4, 5, 6, 7]);
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 81 to 90 of 110 keys",
      );

      cy.log(
        "Should show the correct pagination when going to next pages - Clicking on link for page 10",
      );
      cy.get(`[data-cy="admin-dashboard-pagination-page-10-link"]`).click();

      // page 10
      cy.log(
        "Should show the correct pagination when going to next pages - Verify that the url contain the right page number",
      );
      cy.url().should(
        "eq",
        `${API_DASHBOARD_BASE_URL}/api-keys/manage?page=10`,
      );

      cy.log(
        "Should show the correct pagination when going to next pages - Checking the pagination bar on page 10",
      );
      paginationPreviousItemHasTheRightHref(9);
      paginationLinkHasTheRightHref(1);
      paginationItemHasNotCurrentAsCssClass(1);
      cy.get(`[data-cy="admin-dashboard-pagination-ellipses"]`).should("exist");
      paginationLinkHasTheRightHref(9);
      paginationItemHasNotCurrentAsCssClass(9);
      paginationItemHasCurrentAsCssClass(10);
      paginationLinkHasTheRightHref(10);
      paginationLinkHasTheRightHref(11);
      paginationItemHasNotCurrentAsCssClass(11);
      paginationNextItemHasTheRightHref(11);
      paginationItemsDoesNotExist([2, 3, 4, 5, 6, 7, 8]);
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 91 to 100 of 110 keys",
      );

      cy.log(
        "Should show the correct pagination when going to next pages - Clicking on link for page 11",
      );
      cy.get(`[data-cy="admin-dashboard-pagination-page-11-link"]`).click();

      // page 11
      cy.log(
        "Should show the correct pagination when going to next pages - Verify that the url contain the right page number",
      );
      cy.url().should(
        "eq",
        `${API_DASHBOARD_BASE_URL}/api-keys/manage?page=11`,
      );

      cy.log(
        "Should show the correct pagination when going to next pages - Checking the pagination bar on page 11",
      );
      paginationPreviousItemHasTheRightHref(10);
      paginationLinkHasTheRightHref(1);
      paginationItemHasNotCurrentAsCssClass(1);
      cy.get(`[data-cy="admin-dashboard-pagination-ellipses"]`).should("exist");
      paginationLinkHasTheRightHref(10);
      paginationItemHasNotCurrentAsCssClass(10);
      paginationItemHasCurrentAsCssClass(11);
      paginationLinkHasTheRightHref(11);
      cy.get(`[data-cy="admin-dashboard-pagination-next-page-link"]`).should(
        "not.exist",
      );
      paginationItemsDoesNotExist([2, 3, 4, 5, 6, 7, 8, 9]);
      cy.get(`[data-cy="admin-dashboard-show-keys-count-paragraph"]`).should(
        "have.text",
        "Showing 101 to 110 of 110 keys",
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
        "Should be able to revoke any key from any department - Clicking revoke key link for key Org1Cypress009",
      );
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Revoked-Org1Cypress009-link"]`,
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
        "Should be able to revoke any key from any department - Clicking on link for page 11(last page)",
      );
      cy.get(`[data-cy="admin-dashboard-pagination-page-11-link"]`).click();

      cy.log(
        "Should be able to revoke any key from any department - Verify that the key Org1Cypress009 is revoked",
      );
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Revoked-Org1Cypress009-link"]`,
      ).should("not.exist");
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-API-key-Org1Cypress009"]`,
      ).should("have.text", `Org1Cypress009`);
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Department-Org1Cypress009"]`,
      ).should("have.text", "CypressApiKeysTestOrg");
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Created-Org1Cypress009"]`,
      ).should("have.text", today);
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Revoked-Org1Cypress009-date"]`,
      ).should("contain", today);
      cy.get(`[data-cy="admin-dashboard-active-key-count"]`)
        .should("be.visible")
        .should("have.text", "109 active API keys");

      // filter on second department
      cy.log(
        "Should be able to revoke any key from any department - Selecting CypressApiKeysEvilOrg in the filter",
      );
      cy.get(
        `[data-cy="admin-dashboard-filter-CypressApiKeysEvilOrg-checkbox"]`,
      ).click();
      cy.get(
        `[data-cy="admin-dashboard-filter-CypressApiKeysEvilOrg-checkbox"]`,
      ).should("be.checked");

      cy.log(
        "Should be able to revoke any key from any department - Clicking Apply filters",
      );
      cy.get(`[data-cy="admin-dashboard-filter-apply-button"]`).click();

      cy.log(
        "Should be able to revoke any key from any department - Verify that the url contain the selected department",
      );
      cy.url().should(
        "eq",
        `${API_DASHBOARD_BASE_URL}/api-keys/manage?selectedDepartments=CypressApiKeysEvilOrg`,
      );

      cy.log(
        "Should be able to revoke any key from any department - Verify the checkbox is checked",
      );
      cy.get(
        `[data-cy="admin-dashboard-filter-CypressApiKeysEvilOrg-checkbox"]`,
      ).should("be.checked");

      // revoke key from second department
      cy.log(
        "Should be able to revoke any key from any department - Clicking revoke key link for key Org2Cypress046",
      );
      cy.get(
        `[data-cy="admin-dashboard-list-table-row-Revoked-Org2Cypress046-link"]`,
      ).click();

      cy.log(
        "Should be able to revoke any key from any department - Verify that the url contain the right path",
      );
      cy.url().should("include", `${API_DASHBOARD_BASE_URL}/api-keys/revoke/`);

      // test revoke button
      cy.log(
        "Should be able to revoke any key from any department - clicking revoke button in revoke page",
      );
      cy.get(`[data-cy="revoke-revoke-button"]`).click();

      cy.log(
        "Should be able to revoke any key from any department - Verify that the url contain the right path",
      );
      cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys/manage`);

      cy.get(`[data-cy="admin-dashboard-active-key-count"]`)
        .should("be.visible")
        .should("have.text", "108 active API keys");
    });

    it("Show error page when trying to access Technical support create api key page", () => {
      cy.log(
        "Should show error page when trying to access Technical support create api key page - Trying access Create API key page",
      );
      cy.visit(`${API_DASHBOARD_BASE_URL}/api-keys/create`);
      cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys/error`);
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
        "/find/api/admin/api-keys/manage",
      );
    });

    it("Show error page when trying to access Technical support dashboard page", () => {
      cy.log(
        "Show error page when trying to access Technical support dashboard page - Trying access Technical support dashboard page",
      );

      cy.visit(`${API_DASHBOARD_BASE_URL}/api-keys`);
      cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys/error`);
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
        "/find/api/admin/api-keys/manage",
      );
    });
  });
});
