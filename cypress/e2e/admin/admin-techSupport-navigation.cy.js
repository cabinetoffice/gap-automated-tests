import {
  BASE_URL,
  signInAsAdmin,
  signInToIntegrationSite,
} from "../../common/common";

const API_DASHBOARD_BASE_URL = BASE_URL + "/find/api/admin";
const ADMIN_DASHBOARD_BASE_URL = BASE_URL + "/apply/admin";

describe("Admin navigation", () => {
  beforeEach(() => {
    cy.task("setUpUser");
    cy.task("setUpApplyData");
    cy.task("addTechSupportRoleToAdmin");
    signInToIntegrationSite();
  });

  it("Admin can view the dashboard, cannot access the super-admin dashboard", () => {
    cy.get("[data-cy=cySignInAndApply-Link]").click();
    signInAsAdmin();

    cy.log("Logged into admin account - accessing TechSupport dashboard");
    cy.get("[data-cy=cyapiKeysPageLink]").should("exist");
    cy.get("[data-cy=cyapiKeysPageLink]")
      .click()
      .then(() => cy.url().should("eq", `${API_DASHBOARD_BASE_URL}/api-keys`));
    cy.get("[data-cy=header-navbar-back-to-dashboard-link]").should("exist");
    cy.get("[data-cy=header-navbar-back-to-dashboard-link]")
      .click()
      .then(() =>
        cy.url().should("eq", `${ADMIN_DASHBOARD_BASE_URL}/dashboard`),
      );
  });
});
